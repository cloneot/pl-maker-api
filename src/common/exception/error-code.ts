class ErrorCodeVo {
  readonly status: number;
  readonly message: string;

  constructor(status: number, message: string) {
    this.status = status;
    this.message = message;
  }
}

export type ErrorCode = {
  status: number;
  message: string;
};

export const RESOURCE_NOT_FOUND = new ErrorCodeVo(404, 'Resource Not Found');
export const RESOURCE_ALREADY_EXISTS = new ErrorCodeVo(
  409,
  'Resource Already Exists',
);
export const FORBIDDEN_RESOURCE_ACCESS = new ErrorCodeVo(
  403,
  'You do not have permission to access this resource',
);
