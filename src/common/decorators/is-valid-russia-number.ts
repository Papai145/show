import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ async: true })
export class IsValidRussiaNumberPhoneConstraint
  implements ValidatorConstraintInterface
{
  validate(value: any): Promise<boolean> | boolean {
    return /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/.test(value);
  }
  defaultMessage(): string {
    return 'Number phone not valid';
  }
}
export function IsValidRussiaNumberPhone(
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsValidRussiaNumberPhoneConstraint,
    });
  };
}
