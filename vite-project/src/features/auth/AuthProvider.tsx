import type { ReactNode } from 'react';
import { AuthContext } from './Auth.context';
import { useAuthController } from './AuthProvider.use';

export function AuthProvider({ children }: { children: ReactNode }): React.JSX.Element {
  const value = useAuthController();

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
