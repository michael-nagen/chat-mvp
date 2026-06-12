import type { AuthAction, AuthState } from '../Auth.types';

export const initialAuthState: AuthState = {
  status: 'idle',
  user: null,
  token: null,
  error: null,
};

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
    case 'LOGOUT':
      return initialAuthState;
    default:
      return state;
  }
}
