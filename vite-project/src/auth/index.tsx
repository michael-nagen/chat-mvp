import type { ReactNode } from 'react';
import { AuthContext, useAuth, useAuthController, useAuthScreen } from './Auth.use';
import { AuthScreenView } from './Auth.view';

export { useAuth };

export function AuthProvider({ children }: { children: ReactNode }): React.JSX.Element {
  const value = useAuthController();
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function AuthScreen(): React.JSX.Element {
  const viewProps = useAuthScreen();
  return <AuthScreenView {...viewProps} />;
}
