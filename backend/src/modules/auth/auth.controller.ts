import { loginSchema } from './auth.schemas';
import { authService } from './auth.service';
import { ErrorCodes } from '../../shared/errors/errorCodes';
import { HTTP_STATUS } from '../../shared/http/httpStatus';
import { asyncHandler } from '../../shared/http/asyncHandler';

export const login = asyncHandler((req, res) => {
  const parsed = loginSchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({
      error: {
        code: ErrorCodes.VALIDATION_ERROR,
        message: parsed.error.issues[0]?.message ?? 'Invalid request body.',
      },
    });
    return;
  }

  const result = authService.login(parsed.data.name);
  res.status(HTTP_STATUS.OK).json(result);
});
