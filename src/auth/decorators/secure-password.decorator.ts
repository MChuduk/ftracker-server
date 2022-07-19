import { registerDecorator, ValidationOptions } from 'class-validator';

export function IsSecurePassword(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any): boolean {
          if (!value) {
            this.error = 'empty password';
            return false;
          }
          if (!/[A-Z]/.test(value)) {
            this.error = 'password must contains uppercase letters';
            return false;
          }
          if (!/[a-z]/.test(value)) {
            this.error = 'password must contains lower letters';
            return false;
          }
          if (!/[0-9]/.test(value)) {
            this.error = 'password must contains digits/number';
            return false;
          }
          if (!/[!#$%&'()*+,-./:;<=>?@[\]^_{|}~]/.test(value)) {
            this.error = 'password must contains special characters';
            return false;
          }
          return true;
        },
        defaultMessage(): string {
          return this.error || 'cannot validate password';
        },
      },
    });
  };
}
