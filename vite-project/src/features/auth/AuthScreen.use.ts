import { useState } from 'react';
import type { AuthMode, AuthScreenViewProps } from './Auth.types';
import { useAuth } from './Auth.context';
import { canSubmit, toggleMode } from './model/Auth.utils';

/** Manages local credential + mode state and produces view props for the auth screen. */
export function useAuthScreen(): AuthScreenViewProps {
  const { status, error, login, signup } = useAuth();
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');

  const isLoading = status === 'loading';
  const needsName = mode === 'signup';
  const submittable =
    canSubmit({ email, password, isLoading }) &&
    (!needsName || (firstName.trim().length > 0 && lastName.trim().length > 0));

  function onSubmit(event: React.FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    if (!submittable) return;
    if (mode === 'login') {
      void login(email.trim(), password);
    } else {
      void signup(email.trim(), password, firstName.trim(), lastName.trim());
    }
  }

  return {
    mode,
    onToggleMode: () => setMode(toggleMode),
    email,
    onEmailChange: setEmail,
    firstName,
    onFirstNameChange: setFirstName,
    lastName,
    onLastNameChange: setLastName,
    password,
    onPasswordChange: setPassword,
    onSubmit,
    submittable,
    isLoading,
    error,
  };
}
