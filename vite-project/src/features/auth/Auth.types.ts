import type { User } from '../../shared/entities/User.types';

/** Represents the current phase of the authentication lifecycle. */
export type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'error';

/** Full reducer state managed by the auth context. */
export type AuthState = {
  status: AuthStatus;
  user: User | null;
  token: string | null;
  error: string | null;
};

/** Discriminated union of all actions that can be dispatched to the auth reducer. */
export type AuthAction =
  | { type: 'RESTORE'; user: User; token: string }
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; user: User; token: string }
  | { type: 'LOGIN_ERROR'; error: string };

/** Public shape of the auth context consumed by any component via useAuth. */
export type AuthContextValue = {
  status: AuthStatus;
  user: User | null;
  token: string | null;
  error: string | null;
  isAuthenticated: boolean;
  login: (name: string) => Promise<void>;
};

/** Props passed directly to the pure login screen view component. */
export type AuthScreenViewProps = {
  name: string;
  onNameChange: (value: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
  error: string | null;
};
