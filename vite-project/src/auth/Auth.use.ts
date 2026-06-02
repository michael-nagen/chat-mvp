import { useEffect, useReducer, useState } from 'react';
import { loginByName } from './Auth.api';
import type { AuthContextValue, AuthScreenViewProps } from './Auth.types';
import { useAuth } from './Auth.context';
import { authReducer, initialAuthState } from './Auth.reducer';
import { readStoredAuth, writeStoredAuth } from './Auth.storage';
import { canSubmit } from './Auth.utils';

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

/** Manages local name field state and produces view props for the login screen. */
export function useAuthScreen(): AuthScreenViewProps {
  const { status, error, login } = useAuth();
  const [name, setName] = useState('');

  function onSubmit(): void {
    const trimmed = name.trim();
    if (!trimmed) return;
    void login(trimmed);
  }

  return {
    name,
    onNameChange: setName,
    onSubmit,
    isLoading: status === 'loading',
    error,
  };
}

export type AuthScreenHandlers = { submittable: boolean; handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void };

/** Derives submittable state and a form submit handler from AuthScreenViewProps. */
export function useAuthScreenView(props: AuthScreenViewProps): AuthScreenHandlers {
  const submittable = canSubmit(props.name, props.isLoading);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    if (!submittable) return;
    props.onSubmit();
  }

  return { submittable, handleSubmit };
}
