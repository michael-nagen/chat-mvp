import { UnauthorizedError } from '../../shared/errors/AppError';
import { asyncHandler } from '../../shared/http/asyncHandler';
import { HTTP_STATUS } from '../../shared/http/httpStatus';
import { CreateMessageBody, ListMessagesQuery } from './messages.schemas';
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

  const { cursor, limit } = req.query as unknown as ListMessagesQuery;
  const page = messageOrchestrator.listMessages(req.params.conversationId, userId, { cursor, limit });
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

  const { content } = req.body as CreateMessageBody;
  const message = messageOrchestrator.createMessage(req.params.conversationId, userId, content);
  res.status(HTTP_STATUS.CREATED).json({ message: toResponse(message, userId) });
});
