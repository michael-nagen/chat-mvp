import { Router } from 'express';
import { login } from './auth.controller';
import { loginSchema } from './auth.schemas';
import { validate } from '../../shared/middleware/validate';

export const authRouter = Router();

authRouter.post('/login', validate({ body: loginSchema }), login);
