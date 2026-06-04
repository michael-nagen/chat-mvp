import { loginSchema } from './auth.schemas';
import { authOrchestrator } from './auth.orchestrator';
import { ValidationError } from '../../shared/errors/AppError';
import { HTTP_STATUS } from '../../shared/http/httpStatus';
import { asyncHandler } from '../../shared/http/asyncHandler';

export const login = asyncHandler((req, res) => {
  const parsed = loginSchema.safeParse(req.body);

  if (!parsed.success) {
    throw new ValidationError(parsed.error.issues[0]?.message ?? 'Invalid request body.');
  }

  const result = authOrchestrator.login(parsed.data.name);
  res.status(HTTP_STATUS.OK).json(result);
});
