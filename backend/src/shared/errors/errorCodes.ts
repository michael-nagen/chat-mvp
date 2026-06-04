export const ErrorCodes = {
  NOT_IMPLEMENTED: 'NOT_IMPLEMENTED',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  UNAUTHORIZED: 'UNAUTHORIZED',
  USER_NOT_FOUND: 'USER_NOT_FOUND',
  CONVERSATION_NOT_FOUND: 'CONVERSATION_NOT_FOUND',
} as const;

export type ErrorCode = (typeof ErrorCodes)[keyof typeof ErrorCodes];
