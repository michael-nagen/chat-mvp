import { useRoutes } from 'react-router-dom';
import { ToastProvider } from './features/toast';
import { AppToast } from './children/AppToast';
import { loginRoute } from './children/loginRoute';
import { protectedRoutes } from './children/protectedRoutes';
import { fallbackRoute } from './children/fallbackRoute';

// Toast is a global concern, so its provider wraps every route.
export default function App(): React.JSX.Element {
  const routes = useRoutes([loginRoute, protectedRoutes, fallbackRoute]);
  return (
    <ToastProvider>
      {routes}
      <AppToast />
    </ToastProvider>
  );
}
