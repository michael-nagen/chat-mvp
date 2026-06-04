import { Router } from 'express';
import { createConversation, listConversations } from './conversations.controller';
import { messagesRouter } from '../messages/messages.routes';
import { requireAuth } from '../../shared/middleware/requireAuth';

export const conversationsRouter = Router();

conversationsRouter.use(requireAuth);

conversationsRouter.get('/', listConversations);
conversationsRouter.post('/', createConversation);
conversationsRouter.use('/:id/messages', messagesRouter);
