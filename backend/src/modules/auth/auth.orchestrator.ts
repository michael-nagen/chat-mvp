import { authService } from './auth.service';
import { LoginResult } from './auth.types';

/**
 * Mid-layer between the controller and the service. Login needs no other
 * domain, so this is a straight pass-through; it exists so every controller
 * request goes through the same orchestration seam.
 */
export const authOrchestrator = {
  login(name: string): LoginResult {
    return authService.login(name);
  },
};
