import { useAuthScreen } from './Auth.use';
import { AuthScreenView } from './Auth.view';

export function AuthScreen(): React.JSX.Element {
  const viewProps = useAuthScreen();

  return <AuthScreenView {...viewProps} />;
}
