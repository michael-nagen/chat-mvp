import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useState } from 'react';
import { login as loginApi } from '../shared/chatApi/apiClient';
import type { AuthContextValue, AuthScreenViewProps } from './Auth.types';
import {
  authReducer,
  buildAuthScreenViewProps,
  canSubmit,
  initialAuthState,
  readStoredAuth,
  writeStoredAuth,
} from './Auth.logic';

/** React context that holds the current auth state and actions. */
export const AuthContext = createContext<AuthContextValue | null>(null);

/** Returns the auth context value; throws if called outside an AuthProvider. */
export function useAuth(): AuthContextValue {
  const value = useContext(AuthContext);
  if (!value) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return value;
}

/** Drives the auth provider: wires useReducer, localStorage restore, and the login callback. */
export function useAuthController(): AuthContextValue {
  const [state, dispatch] = useReducer(authReducer, initialAuthState);

  useEffect(() => {
    const stored = readStoredAuth();
    if (stored) {
      dispatch({ type: 'RESTORE', user: stored.user, token: stored.token });
    }
  }, []);

  const login = useCallback(async (name: string): Promise<void> => {
    dispatch({ type: 'LOGIN_START' });
    try {
      const res = await loginApi(name);
      writeStoredAuth({ user: res.user, token: res.token });
      dispatch({ type: 'LOGIN_SUCCESS', user: res.user, token: res.token });
    } catch (err) {
      dispatch({
        type: 'LOGIN_ERROR',
        error: err instanceof Error ? err.message : 'Failed to log in',
      });
    }
  }, []);

  return useMemo(
    () => ({
      status: state.status,
      user: state.user,
      token: state.token,
      error: state.error,
      isAuthenticated: state.status === 'authenticated' && state.user !== null,
      login,
    }),
    [state, login],
  );
}

/** Manages local name field state and produces view props for the login screen. */
export function useAuthScreen(): AuthScreenViewProps {
  const { status, error, login } = useAuth();
  const [name, setName] = useState('');

  const onSubmit = useCallback((): void => {
    const trimmed = name.trim();
    if (!trimmed) return;
    void login(trimmed);
  }, [name, login]);

  return buildAuthScreenViewProps({
    name,
    onNameChange: setName,
    onSubmit,
    status,
    error,
  });
}

export type AuthScreenHandlers = { submittable: boolean; handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void };

/** Derives submittable state and a form submit handler from AuthScreenViewProps. */
export function useAuthScreenView(props: AuthScreenViewProps): AuthScreenHandlers {
  const submittable = canSubmit(props.name, props.isLoading);

  const handleSubmit = useCallback((event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    if (!submittable) return;
    props.onSubmit();
  }, [submittable, props]);

  return { submittable, handleSubmit };
}
