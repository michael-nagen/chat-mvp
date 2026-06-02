import type { User } from '../../shared/entities/User.types';
import { AUTH_STORAGE_KEY } from './Auth.constants';

type StoredAuth = { user: User; token: string };

export function readStoredAuth(): StoredAuth | null {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as Partial<StoredAuth>;
    if (parsed.user && typeof parsed.token === 'string') {
      return { user: parsed.user, token: parsed.token };
    }

    return null;
  } catch {
    return null;
  }
}

export function writeStoredAuth(value: StoredAuth): void {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(value));
}

export function clearStoredAuth(): void {
  localStorage.removeItem(AUTH_STORAGE_KEY);
}
