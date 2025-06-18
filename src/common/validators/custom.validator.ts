import { BadRequestException } from '@nestjs/common';
import { ValidationError } from 'class-validator';

export function customValidator(validationErrors: ValidationError[]) {
  if (!validationErrors || validationErrors.length === 0) {
    return new BadRequestException('Validation failed');
    // return;
  }

  const messages = validationErrors.map((error) => {
    const field = error.property;
    const constraints = error.constraints;
    if (constraints) {
      const constraintMessages = Object.values(constraints).join(', ');
      return `Validation failed for field "${field}": ${constraintMessages}`;
    } else {
      return `Validation failed for field "${field}" (no specific constraint message).`; // Добавляем обработку случая, когда нет constraints
    }
  });

  const result = messages.join('\n');
  return new BadRequestException(result);
}
