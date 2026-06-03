import { ErrorCode, ErrorCodes } from './errorCodes';

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: ErrorCode;

  constructor(statusCode: number, code: ErrorCode, message: string) {
    super(message);
    this.name = new.target.name;
    this.statusCode = statusCode;
    this.code = code;
  }
}

export class NotImplementedError extends AppError {
  constructor(message = 'Not implemented.') {
    super(501, ErrorCodes.NOT_IMPLEMENTED, message);
  }
}
