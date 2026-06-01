import type { ReactNode } from 'react';
import { AuthContext } from './Auth.context';
import { useAuthController } from './Auth.use';

export function AuthProvider({ children }: { children: ReactNode }): React.JSX.Element {
  const value = useAuthController();

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
