import type { AuthMode } from '../Auth.types';

export function canSubmit({
  email,
  password,
  isLoading,
}: {
  email: string;
  password: string;
  isLoading: boolean;
}): boolean {
  return email.trim().length > 0 && password.length > 0 && !isLoading;
}

export function toggleMode(current: AuthMode): AuthMode {
  return current === 'login' ? 'signup' : 'login';
}
