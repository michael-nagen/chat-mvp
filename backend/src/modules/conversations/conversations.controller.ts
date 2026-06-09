import { asyncHandler } from '../../shared/http/asyncHandler';
import { HTTP_STATUS } from '../../shared/http/httpStatus';
import { CreateConversationBody } from './conversations.schemas';
import { conversationOrchestrator } from './conversations.orchestrator';

export const listConversations = asyncHandler((_req, res) => {
  const userId = res.locals.userId!;
  const conversations = conversationOrchestrator.getForUser(userId);
  res.status(HTTP_STATUS.OK).json({ conversations });
});

export const createConversation = asyncHandler((req, res) => {
  const userId = res.locals.userId!;
  const { title } = req.body as CreateConversationBody;
  const conversation = conversationOrchestrator.createConversation({ title, userId });
  res.status(HTTP_STATUS.CREATED).json(conversation);
});
