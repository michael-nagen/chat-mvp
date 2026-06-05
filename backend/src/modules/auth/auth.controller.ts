import { LoginBody } from './auth.schemas';
import { authOrchestrator } from './auth.orchestrator';
import { HTTP_STATUS } from '../../shared/http/httpStatus';
import { asyncHandler } from '../../shared/http/asyncHandler';

export const login = asyncHandler((req, res) => {
  const { name } = req.body as LoginBody;
  const result = authOrchestrator.login(name);
  res.status(HTTP_STATUS.OK).json(result);
});
