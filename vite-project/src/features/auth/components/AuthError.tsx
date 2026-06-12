import { authStyles } from './Auth.styles';
import { useAuthScreenContext } from '../AuthScreen.context';

/** Inline error row shown below the credential fields; renders nothing when there is no error. */
export function AuthError(): React.JSX.Element | null {
  const { error } = useAuthScreenContext();
  if (!error) return null;
  return <div style={authStyles.error}>{error}</div>;
}
