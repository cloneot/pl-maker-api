import {
  ErrorCode,
  RESOURCE_ALREADY_EXISTS,
  RESOURCE_NOT_FOUND,
  FORBIDDEN_RESOURCE_ACCESS,
} from './error-code';

export class ServiceException extends Error {
  readonly errorCode: ErrorCode;

  constructor(errorCode: ErrorCode, message?: string) {
    super(message || errorCode.message);
    this.errorCode = errorCode;
  }
}

export class ResourceNotFoundException extends ServiceException {
  constructor(message?: string) {
    super(RESOURCE_NOT_FOUND, message);
  }
}

export class ResourceAlreadyExistsException extends ServiceException {
  constructor(message?: string) {
    super(RESOURCE_ALREADY_EXISTS, message);
  }
}

export class ForbiddenResourceAccessException extends ServiceException {
  constructor(message?: string) {
    super(FORBIDDEN_RESOURCE_ACCESS, message);
  }
}
