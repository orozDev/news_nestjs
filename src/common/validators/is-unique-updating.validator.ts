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

@ValidatorConstraint({ async: true })
@Injectable()
export class IsUniqueUpdatingConstraint
  implements ValidatorConstraintInterface
{
  private moduleRef: any;

  async validate(value: any, args: ValidationArguments) {
    const [modelName, propertyName, idField] = args.constraints;
    const model = this.moduleRef.get<Model<any>>(getModelToken(modelName), {
      strict: false,
    });
    if (!model) return false;
    const entityId = (args.object as any).__context.params[idField];
    const existingEntity = await model.findOne({ [propertyName]: value });
    return !existingEntity || existingEntity[idField] === entityId;
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} must be unique`;
  }
}

export const IsUniqueUpdating = (
  modelName: string,
  idField = '_id',
  validationOptions?: ValidationOptions,
) => {
  return (object: object, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [modelName, propertyName, idField],
      validator: IsUniqueUpdatingConstraint,
    });
  };
};
