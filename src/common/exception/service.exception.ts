import {
  ENTITY_ALREADY_EXISTS,
  ENTITY_NOT_FOUND,
  ErrorCode,
} from './error-code';

export class ServiceException extends Error {
  readonly errorCode: ErrorCode;

  constructor(errorCode: ErrorCode, message?: string) {
    super(message || errorCode.message);
    this.errorCode = errorCode;
  }
}

export class EntityNotFoundException extends ServiceException {
  constructor(message?: string) {
    super(ENTITY_NOT_FOUND, message);
  }
}

export class EntityAlreadyExistsException extends ServiceException {
  constructor(message?: string) {
    super(ENTITY_ALREADY_EXISTS, message);
  }
}
