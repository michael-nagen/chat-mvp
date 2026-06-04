import { UnauthorizedError, ValidationError } from '../../shared/errors/AppError';
import { asyncHandler } from '../../shared/http/asyncHandler';
import { HTTP_STATUS } from '../../shared/http/httpStatus';
import { createConversationSchema } from './conversations.schemas';
import { conversationService } from './conversations.service';

export const listConversations = asyncHandler((req, res) => {
  const userId = req.userId;
  if (!userId) {
    throw new UnauthorizedError();
  }

  const conversations = conversationService.getForUser(userId);
  res.status(HTTP_STATUS.OK).json({ conversations });
});

export const createConversation = asyncHandler((req, res) => {
  const userId = req.userId;
  if (!userId) {
    throw new UnauthorizedError();
  }

  const parsed = createConversationSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new ValidationError(parsed.error.issues[0]?.message ?? 'Invalid request body.');
  }

  const conversation = conversationService.createConversation({ title: parsed.data.title, userId });
  res.status(HTTP_STATUS.CREATED).json(conversation);
});
