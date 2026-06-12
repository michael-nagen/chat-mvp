import { createContext, useContext } from 'react';
import type { AuthScreenViewProps } from './Auth.types';

export const AuthScreenContext = createContext<AuthScreenViewProps | null>(null);

export function useAuthScreenContext(): AuthScreenViewProps {
  const value = useContext(AuthScreenContext);
  if (!value) {
    throw new Error('useAuthScreenContext must be used within AuthScreen');
  }

  return value;
}
