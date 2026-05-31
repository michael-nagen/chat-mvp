import type { User } from '../shared/contract/contract';
import { AUTH_STORAGE_KEY } from './Auth.constants';
import type {
  AuthAction,
  AuthScreenViewProps,
  AuthState,
  AuthStatus,
} from './Auth.types';

/** Default auth state used when the reducer is first initialised. */
export const initialAuthState: AuthState = {
  status: 'idle',
  user: null,
  token: null,
  error: null,
};

/** Pure reducer that transitions auth state in response to login lifecycle actions. */
export function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'RESTORE':
      return { status: 'authenticated', user: action.user, token: action.token, error: null };
    case 'LOGIN_START':
      return { ...state, status: 'loading', error: null };
    case 'LOGIN_SUCCESS':
      return { status: 'authenticated', user: action.user, token: action.token, error: null };
    case 'LOGIN_ERROR':
      return { status: 'error', user: null, token: null, error: action.error };
    default:
      return state;
  }
}

const STORAGE_KEY = AUTH_STORAGE_KEY;

type StoredAuth = { user: User; token: string };

/** Reads and validates a previously persisted auth session from localStorage. */
export function readStoredAuth(): StoredAuth | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
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

/** Persists the authenticated user and token to localStorage. */
export function writeStoredAuth(value: StoredAuth): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
}

/** Removes the persisted auth session from localStorage on logout. */
export function clearStoredAuth(): void {
  localStorage.removeItem(STORAGE_KEY);
}

/** Maps raw auth state and callbacks into the props shape expected by AuthScreenView. */
export function buildAuthScreenViewProps(args: {
  name: string;
  onNameChange: (value: string) => void;
  onSubmit: () => void;
  status: AuthStatus;
  error: string | null;
}): AuthScreenViewProps {
  return {
    name: args.name,
    onNameChange: args.onNameChange,
    onSubmit: args.onSubmit,
    isLoading: args.status === 'loading',
    error: args.error,
  };
}

/** Returns true only when the name field has text and no login is in flight. */
export function canSubmit(name: string, isLoading: boolean): boolean {
  return name.trim().length > 0 && !isLoading;
}
