import { useRoutes } from 'react-router-dom';
import { ToastProvider, Toast } from './features/toast';
import { routes } from './routing';

// Toast is a global concern, so its provider wraps every route.
export default function App(): React.JSX.Element {
  const element = useRoutes(routes);
  return (
    <ToastProvider>
      {element}
      <Toast />
    </ToastProvider>
  );
}
