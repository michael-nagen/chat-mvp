import { createContext, useContext } from 'react';
import type { AuthContextValue } from './Auth.types';

export const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth(): AuthContextValue {
  const value = useContext(AuthContext);
  if (!value) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return value;
}
