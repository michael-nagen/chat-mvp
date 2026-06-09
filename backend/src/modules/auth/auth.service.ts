import { LoginResult, User } from './auth.types';
import { UnauthorizedError } from '../../shared/errors/AppError';
import { authRepository } from './auth.repo';

export const authService = {
  getUser(userId: string): User | undefined {
    return authRepository.findById(userId);
  },

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
