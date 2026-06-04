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

export class ValidationError extends AppError {
  constructor(message = 'Invalid request.') {
    super(400, ErrorCodes.VALIDATION_ERROR, message);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized.') {
    super(401, ErrorCodes.UNAUTHORIZED, message);
  }
}

export class UserNotFoundError extends AppError {
  constructor(message = 'User not found.') {
    super(404, ErrorCodes.USER_NOT_FOUND, message);
  }
}

export class ConversationNotFoundError extends AppError {
  constructor(message = 'Conversation not found.') {
    super(404, ErrorCodes.CONVERSATION_NOT_FOUND, message);
  }
}
