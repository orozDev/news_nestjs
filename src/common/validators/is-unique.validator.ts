import { Injectable } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  ValidationOptions,
  registerDecorator,
} from 'class-validator';
import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { ModuleRef } from '@nestjs/core';

@ValidatorConstraint({ async: true })
@Injectable()
export class IsUniqueConstraint implements ValidatorConstraintInterface {
  constructor(private readonly moduleRef: ModuleRef) {}

  async validate(value: any, args: ValidationArguments) {
    const [modelName, propertyName] = args.constraints;
    const model = this.moduleRef.get<Model<any>>(getModelToken(modelName), {
      strict: false,
    });
    if (!model) return false;
    const count = await model.countDocuments({ [propertyName]: value });
    return count === 0;
  }

  defaultMessage(args: ValidationArguments) {
    return `This ${args.property} is already exists.`;
  }
}

export const IsUnique = (modelName: string, args?: ValidationOptions) => {
  return (object: object, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: args,
      constraints: [modelName, propertyName],
      validator: IsUniqueConstraint,
    });
  };
};
