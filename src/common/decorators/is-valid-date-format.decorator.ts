// src/common/decorators/is-valid-date-format.decorator.ts

import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ async: false })
export class IsValidDateFormatConstraint
  implements ValidatorConstraintInterface
{
  validate(value: any) {
    if (typeof value !== 'string') {
      return false; // Not a string
    }
    return /^\d{4}-\d{2}-\d{2}$/.test(value); // YYYY-MM-DD format
  }

  defaultMessage() {
    return 'Date format must be YYYY-MM-DD';
  }
}

export function IsValidDateFormat(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsValidDateFormatConstraint,
    });
  };
}
