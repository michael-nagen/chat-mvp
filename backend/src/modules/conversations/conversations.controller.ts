import { UnauthorizedError } from '../../shared/errors/AppError';
import { asyncHandler } from '../../shared/http/asyncHandler';
import { HTTP_STATUS } from '../../shared/http/httpStatus';
import { CreateConversationBody } from './conversations.schemas';
import { conversationOrchestrator } from './conversations.orchestrator';

export const listConversations = asyncHandler((req, res) => {
  const userId = req.userId;
  if (!userId) {
    throw new UnauthorizedError();
  }

  const conversations = conversationOrchestrator.getForUser(userId);
  res.status(HTTP_STATUS.OK).json({ conversations });
});

export const createConversation = asyncHandler((req, res) => {
  const userId = req.userId;
  if (!userId) {
    throw new UnauthorizedError();
  }

  const { title } = req.body as CreateConversationBody;
  const conversation = conversationOrchestrator.createConversation({ title, userId });
  res.status(HTTP_STATUS.CREATED).json(conversation);
});
