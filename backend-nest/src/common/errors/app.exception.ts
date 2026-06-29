import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrorCode, ErrorCodes } from './error-codes';

// Wraps Nest's HttpException so every domain error carries a stable `code`
// alongside the HTTP status, matching the Express backend's error contract.
export class AppException extends HttpException {
  readonly code: ErrorCode;

  constructor(status: HttpStatus, code: ErrorCode, message: string) {
    super(message, status);
    this.code = code;
  }
}

export class ValidationException extends AppException {
  constructor(message = 'Invalid request.') {
    super(HttpStatus.BAD_REQUEST, ErrorCodes.VALIDATION_ERROR, message);
  }
}

export class UnauthorizedException extends AppException {
  constructor(message = 'Unauthorized.') {
    super(HttpStatus.UNAUTHORIZED, ErrorCodes.UNAUTHORIZED, message);
  }
}

export class ForbiddenException extends AppException {
  constructor(message = 'You do not have access to this resource.') {
    super(HttpStatus.FORBIDDEN, ErrorCodes.FORBIDDEN, message);
  }
}

export class NotFoundException extends AppException {
  constructor(message = 'The requested resource was not found.') {
    super(HttpStatus.NOT_FOUND, ErrorCodes.NOT_FOUND, message);
  }
}

export class ConversationNotFoundException extends AppException {
  constructor(message = 'Conversation not found.') {
    super(HttpStatus.NOT_FOUND, ErrorCodes.CONVERSATION_NOT_FOUND, message);
  }
}

export class ConflictException extends AppException {
  constructor(message = 'Resource already exists.') {
    super(HttpStatus.CONFLICT, ErrorCodes.CONFLICT, message);
  }
}
