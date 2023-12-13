import { DomainException } from '@shared/domain/exceptions/baseException';
import { StringValueObject } from '@shared/domain/valueObjects/stringValueObject';
import { IntegerValueObject } from '@shared/domain/valueObjects/integerValueObject';
import { ERROR_CODES } from '@shared/domain/exceptions/errorsCode';
import { ErrorType } from '@shared/domain/valueObjects/errorTypeEnum';
import { UserName } from '@services/users/domain/valueObjects/userName';

export class UserNameAlreadyExistException extends DomainException {
  constructor (email: UserName) {
    super({
      name: StringValueObject.build('UserNameAlreadyExistException'),
      message: StringValueObject.build(`There is already a user with this same username`),
      status: IntegerValueObject.build(400),
      code: StringValueObject.build(ERROR_CODES['UserNameAlreadyExistException']),
      errorType: ErrorType.warn(),
      metadata: { email: email.value },
    });
  }
}
