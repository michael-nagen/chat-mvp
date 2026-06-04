import { UnauthorizedError, ValidationError } from '../../shared/errors/AppError';
import { asyncHandler } from '../../shared/http/asyncHandler';
import { HTTP_STATUS } from '../../shared/http/httpStatus';
import { createMessageSchema, listMessagesQuerySchema } from './messages.schemas';
import { messageOrchestrator } from './messages.orchestrator';
import { Message } from './messages.types';

// Maps the stored message to the FE contract shape. The `sender` role is
// relative to the caller: their own messages are 'user', everyone else's
// are 'assistant'.
const toResponse = (message: Message, currentUserId: string) => ({
  id: message.id,
  conversationId: message.conversationId,
  content: message.content,
  sender: message.senderId === currentUserId ? 'user' : 'assistant',
  timestamp: message.createdAt,
});

export const listMessages = asyncHandler((req, res) => {
  const userId = req.userId;
  if (!userId) {
    throw new UnauthorizedError();
  }

  const parsed = listMessagesQuerySchema.safeParse(req.query);
  if (!parsed.success) {
    throw new ValidationError(parsed.error.issues[0]?.message ?? 'Invalid query parameters.');
  }

  const { cursor, limit } = parsed.data;
  const page = messageOrchestrator.listMessages(req.params.id, userId, { cursor, limit });
  res.status(HTTP_STATUS.OK).json({
    messages: page.messages.map((message) => toResponse(message, userId)),
    nextCursor: page.nextCursor,
  });
});

export const createMessage = asyncHandler((req, res) => {
  const userId = req.userId;
  if (!userId) {
    throw new UnauthorizedError();
  }

  const parsed = createMessageSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new ValidationError(parsed.error.issues[0]?.message ?? 'Invalid request body.');
  }

  const message = messageOrchestrator.createMessage(req.params.id, userId, parsed.data.content);
  res.status(HTTP_STATUS.CREATED).json({ message: toResponse(message, userId) });
});
