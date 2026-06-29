import { useEffect, useReducer } from 'react';
import type { User } from '../../shared/entities/User.types';
import type { AuthResponse } from './model/Auth.api';
import { login as loginRequest, signup as signupRequest } from './model/Auth.api';
import type { AuthContextValue } from './Auth.types';
import { authReducer, initialAuthState } from './model/Auth.reducer';
import { clearStoredAuth, readStoredAuth, writeStoredAuth } from './model/Auth.storage';

/** Drives the auth provider: wires useReducer, localStorage restore, and the auth callbacks. */
export function useAuthController(): AuthContextValue {
  const [state, dispatch] = useReducer(authReducer, initialAuthState);

  useEffect(() => {
    const stored = readStoredAuth();
    if (stored) {
      dispatch({ type: 'RESTORE', user: stored.user, token: stored.token });
    }
  }, []);

  async function authenticate(request: () => Promise<AuthResponse>): Promise<void> {
    dispatch({ type: 'LOGIN_START' });
    try {
      const res = await request();
      writeStoredAuth({ user: res.user, token: res.token });
      dispatch({ type: 'LOGIN_SUCCESS', user: res.user, token: res.token });
    } catch (err) {
      dispatch({
        type: 'LOGIN_ERROR',
        error: err instanceof Error ? err.message : 'Authentication failed',
      });
    }
  }

  function logout(): void {
    clearStoredAuth();
    dispatch({ type: 'LOGOUT' });
  }

  function updateUser(user: User): void {
    if (state.token) {
      writeStoredAuth({ user, token: state.token });
    }
    dispatch({ type: 'USER_UPDATED', user });
  }

  return {
    status: state.status,
    user: state.user,
    token: state.token,
    error: state.error,
    isAuthenticated: state.status === 'authenticated' && state.user !== null,
    login: (email, password) => authenticate(() => loginRequest({ email, password })),
    signup: (email, password, firstName, lastName) =>
      authenticate(() => signupRequest({ email, password, firstName, lastName })),
    updateUser,
    logout,
  };
}
