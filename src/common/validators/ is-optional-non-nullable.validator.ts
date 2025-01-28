import { IsOptional, ValidateIf, ValidationOptions } from 'class-validator';

export const IsOptionalNonNullable = (data?: {
  nullable: boolean;
  validationOptions?: ValidationOptions;
}) => {
  const { nullable = false, validationOptions = undefined } = data || {};

  if (nullable) {
    return IsOptional(validationOptions);
  }

  return ValidateIf((ob: any, v: any) => {
    return v !== undefined;
  }, validationOptions);
};
