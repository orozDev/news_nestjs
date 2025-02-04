import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { ModuleRef } from '@nestjs/core';

@ValidatorConstraint({ async: true })
@Injectable()
export class IsExistedConstraint implements ValidatorConstraintInterface {
  constructor(private readonly moduleRef: ModuleRef) {}

  async validate(value: any, args: ValidationArguments): Promise<boolean> {
    const [modelName, idField, many, notExisted] = args.constraints;

    const model = this.moduleRef.get<Model<any>>(getModelToken(modelName), {
      strict: false,
    });
    if (!model) return false;

    if (many) {
      if (typeof value === 'string') {
        value = value.split(',');
      }

      for (const item of value) {
        const count = await model.countDocuments({ [idField]: item });
        if (count === 0) notExisted.push(item);
      }
      args.constraints.push(notExisted);
      return notExisted.length === 0;
    }

    const count = await model.countDocuments({ [idField]: value });
    return count > 0;
  }

  defaultMessage(args?: ValidationArguments) {
    const [modelName, idField, many, notExisted] = args.constraints;
    if (many) {
      args.constraints[3] = [];
      return `The items ${notExisted.join(', ')} of ${args.property} do not exist`;
    }
    return `${args.property} does not exist`;
  }
}

export const IsExisted = (
  modelName: string,
  idField = '_id',
  many = false,
  args?: ValidationOptions,
) => {
  return (object: object, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: args,
      constraints: [modelName, idField, many, []],
      validator: IsExistedConstraint,
    });
  };
};
