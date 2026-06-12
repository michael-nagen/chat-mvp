import { useState } from 'react';
import type { AuthScreenViewProps } from './Auth.types';
import { useAuth } from './Auth.context';
import { canSubmit } from './model/Auth.utils';

/** Manages local name field state and produces view props for the login screen. */
export function useAuthScreen(): AuthScreenViewProps {
  const { status, error, login } = useAuth();
  const [name, setName] = useState('');

  const isLoading = status === 'loading';
  const submittable = canSubmit(name, isLoading);

  function onSubmit(event: React.FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    if (!submittable) return;
    void login(name.trim());
  }

  return {
    name,
    onNameChange: setName,
    onSubmit,
    submittable,
    isLoading,
    error,
  };
}
