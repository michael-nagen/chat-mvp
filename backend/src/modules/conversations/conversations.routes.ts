import { Router } from 'express';
import { createConversation, listConversations } from './conversations.controller';
import { messagesRouter } from '../messages/messages.routes';

export const conversationsRouter = Router();

conversationsRouter.get('/', listConversations);
conversationsRouter.post('/', createConversation);
conversationsRouter.use('/:id/messages', messagesRouter);
