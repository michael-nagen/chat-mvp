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

/** Whether the auth screen is signing into an existing account or creating one. */
export type AuthMode = 'login' | 'signup';

/** Discriminated union of all actions that can be dispatched to the auth reducer. */
export type AuthAction =
  | { type: 'RESTORE'; user: User; token: string }
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; user: User; token: string }
  | { type: 'LOGIN_ERROR'; error: string }
  | { type: 'USER_UPDATED'; user: User }
  | { type: 'LOGOUT' };

/** Public shape of the auth context consumed by any component via useAuth. */
export type AuthContextValue = {
  status: AuthStatus;
  user: User | null;
  token: string | null;
  error: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
  ) => Promise<void>;
  // Replaces the current user after a profile change (name/email/avatar).
  updateUser: (user: User) => void;
  logout: () => void;
};

/** Shared screen state exposed via AuthScreenContext and consumed by each child component. */
export type AuthScreenViewProps = {
  mode: AuthMode;
  onToggleMode: () => void;
  email: string;
  onEmailChange: (value: string) => void;
  firstName: string;
  onFirstNameChange: (value: string) => void;
  lastName: string;
  onLastNameChange: (value: string) => void;
  password: string;
  onPasswordChange: (value: string) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  submittable: boolean;
  isLoading: boolean;
  error: string | null;
};
