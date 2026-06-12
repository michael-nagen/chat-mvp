import { authService } from './auth.service';
import { LoginResult, User } from './auth.types';

export const authOrchestrator = {
  getUser(userId: string): User | undefined {
    return authService.getUser(userId);
  },

  login(name: string): LoginResult {
    return authService.login(name);
  },
};
