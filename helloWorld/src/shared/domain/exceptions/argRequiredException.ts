import { DomainException } from '@shared/domain/exceptions/baseException';
import { StringValueObject } from '@shared/domain/valueObjects/stringValueObject';
import { IntegerValueObject } from '@shared/domain/valueObjects/integerValueObject';
import { ERROR_CODES } from '@shared/domain/exceptions/errorsCode';
import { ErrorType } from '@shared/domain/valueObjects/errorTypeEnum';

export class ArgRequiredException extends DomainException {
  constructor (args: string | string[]) {
    super({
      name: StringValueObject.build('ArgRequiredException'),
      message: StringValueObject.build(`The following arguments are required: ${typeof args === 'string' ? args : args.join(', ')}`),
      status: IntegerValueObject.build(500),
      code: StringValueObject.build(ERROR_CODES['ArgRequiredException']),
      errorType: ErrorType.error(),
    });
  }
}
