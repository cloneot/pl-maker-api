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

export const ENTITY_NOT_FOUND = new ErrorCodeVo(404, 'Entity Not Found');
export const ENTITY_ALREADY_EXISTS = new ErrorCodeVo(
  409,
  'Entity Already Exists',
);
