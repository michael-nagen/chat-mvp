import { useEffect, useReducer } from 'react';
import { loginByName } from './model/Auth.api';
import type { AuthContextValue } from './Auth.types';
import { authReducer, initialAuthState } from './model/Auth.reducer';
import { readStoredAuth, writeStoredAuth } from './model/Auth.storage';

/** Drives the auth provider: wires useReducer, localStorage restore, and the login callback. */
export function useAuthController(): AuthContextValue {
  const [state, dispatch] = useReducer(authReducer, initialAuthState);

  useEffect(() => {
    const stored = readStoredAuth();
    if (stored) {
      dispatch({ type: 'RESTORE', user: stored.user, token: stored.token });
    }
  }, []);

  async function login(name: string): Promise<void> {
    dispatch({ type: 'LOGIN_START' });
    try {
      const res = await loginByName(name);
      writeStoredAuth({ user: res.user, token: res.token });
      dispatch({ type: 'LOGIN_SUCCESS', user: res.user, token: res.token });
    } catch (err) {
      dispatch({
        type: 'LOGIN_ERROR',
        error: err instanceof Error ? err.message : 'Failed to log in',
      });
    }
  }

  return {
    status: state.status,
    user: state.user,
    token: state.token,
    error: state.error,
    isAuthenticated: state.status === 'authenticated' && state.user !== null,
    login,
  };
}
