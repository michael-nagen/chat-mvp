import express from 'express';
import cors from 'cors';
import { authRouter } from './modules/auth/auth.routes';
import { conversationsRouter } from './modules/conversations/conversations.routes';
import { errorHandler } from './shared/errors/errorHandler';

export const app = express();

app.use(cors());
app.use(express.json());

app.use('/auth', authRouter);
app.use('/conversations', conversationsRouter);

app.use(errorHandler);
