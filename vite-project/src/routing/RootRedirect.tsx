import { Navigate } from 'react-router-dom';
import { useAuth } from '../features/auth';

// Unknown path falls back to wherever the current auth state points.
export function RootRedirect(): React.JSX.Element {
  const { isAuthenticated } = useAuth();

  return <Navigate to={isAuthenticated ? '/chat' : '/login'} replace />;
}
