import { asyncHandler } from '../../shared/http/asyncHandler';
import { HTTP_STATUS } from '../../shared/http/httpStatus';
import { CreateMessageBody, ListMessagesQuery } from './messages.schemas';
import { messageOrchestrator } from './messages.orchestrator';

export const listMessages = asyncHandler((req, res) => {
  const userId = res.locals.userId!;
  const { cursor, limit } = req.query as unknown as ListMessagesQuery;
  const page = messageOrchestrator.listMessages(req.params.conversationId, userId, { cursor, limit });
  res.status(HTTP_STATUS.OK).json(page);
});

export const createMessage = asyncHandler((req, res) => {
  const userId = res.locals.userId!;
  const { content } = req.body as CreateMessageBody;
  const message = messageOrchestrator.createMessage(req.params.conversationId, userId, content);
  res.status(HTTP_STATUS.CREATED).json({ message });
});
