import { Router } from 'express';
import { createMessage, listMessages } from './messages.controller';

export const messagesRouter = Router({ mergeParams: true });

messagesRouter.get('/', listMessages);
messagesRouter.post('/', createMessage);
