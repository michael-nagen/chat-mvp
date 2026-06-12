import { HTTP_STATUS } from '../http/httpStatus';
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

export class ValidationError extends AppError {
  constructor(message = 'Invalid request.') {
    super(HTTP_STATUS.BAD_REQUEST, ErrorCodes.VALIDATION_ERROR, message);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized.') {
    super(HTTP_STATUS.UNAUTHORIZED, ErrorCodes.UNAUTHORIZED, message);
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'The requested resource was not found.') {
    super(HTTP_STATUS.NOT_FOUND, ErrorCodes.NOT_FOUND, message);
  }
}

export class ConversationNotFoundError extends AppError {
  constructor(message = 'Conversation not found.') {
    super(HTTP_STATUS.NOT_FOUND, ErrorCodes.CONVERSATION_NOT_FOUND, message);
  }
}
