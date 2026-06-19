import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../features/auth';

// Gate for the protected route group: unauthenticated users land on /login.
export function RequireAuth(): React.JSX.Element {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}
