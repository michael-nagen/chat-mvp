export const ErrorCodes = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  UNAUTHORIZED: 'UNAUTHORIZED',
  CONVERSATION_NOT_FOUND: 'CONVERSATION_NOT_FOUND',
} as const;

export type ErrorCode = (typeof ErrorCodes)[keyof typeof ErrorCodes];
