import { Navigate } from 'react-router-dom';
import { AuthScreen, useAuth } from '../features/auth';

// Authenticated users never see /login; they bounce to /chat.
export function LoginGate(): React.JSX.Element {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? <Navigate to="/chat" replace /> : <AuthScreen />;
}
