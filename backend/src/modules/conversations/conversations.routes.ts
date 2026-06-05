import { Router } from 'express';
import { createConversation, listConversations } from './conversations.controller';
import { createConversationSchema } from './conversations.schemas';
import { requireAuth } from '../../shared/middleware/requireAuth';
import { validate } from '../../shared/middleware/validate';

export const conversationsRouter = Router();

conversationsRouter.use(requireAuth);

conversationsRouter.get('/', listConversations);
conversationsRouter.post('/', validate({ body: createConversationSchema }), createConversation);
