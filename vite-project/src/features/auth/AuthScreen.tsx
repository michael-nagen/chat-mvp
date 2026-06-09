import { useAuthScreen } from './AuthScreen.use';
import { AuthScreenView } from './components/Auth.view';

export function AuthScreen(): React.JSX.Element {
  const viewProps = useAuthScreen();

  return <AuthScreenView {...viewProps} />;
}
