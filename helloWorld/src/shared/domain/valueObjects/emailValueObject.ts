import { StringValueObject } from '@shared/domain/valueObjects/stringValueObject';
import { ArgInvalidException } from '@shared/domain/exceptions/argInvalidException';

export class EmailValueObject extends StringValueObject {
  protected static EMAIL_REGEX: RegExp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

  protected constructor(value: string) {
    super(value);

    this.validateEmail(value);
  }

  public static build(value: string): EmailValueObject {
    return new EmailValueObject(value);
  }

  protected validateEmail(value: string): void {
    if (!EmailValueObject.EMAIL_REGEX.test(value)) {
      throw new ArgInvalidException(this.constructor.name, value);
    }
  }
}
