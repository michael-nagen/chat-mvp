import { LoginResult } from './auth.types';
import { UnauthorizedError } from '../../shared/errors/AppError';
import { authRepository } from './auth.repo';

export const authService = {
  login(name: string): LoginResult {
    const user = authRepository.findByName(name);

    if (!user) {
      throw new UnauthorizedError('User not found');
    }

    return {
      token: `mock-token-${user.id}`,
      user,
    };
  },
};
