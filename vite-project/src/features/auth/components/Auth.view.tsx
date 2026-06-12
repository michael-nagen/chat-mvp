import { authStyles } from './Auth.styles';
import { useAuthScreenContext } from '../AuthScreen.context';
import { AuthHeader } from './AuthHeader';
import { AuthCredentialFields } from './AuthCredentialFields';
import { AuthError } from './AuthError';
import { AuthSubmitButton } from './AuthSubmitButton';
import { AuthModeToggle } from './AuthModeToggle';

/** Composes the centred auth card; children read their own data from the screen context. */
export function AuthScreenView(): React.JSX.Element {
  const { onSubmit } = useAuthScreenContext();

  return (
    <div style={authStyles.overlay}>
      <form onSubmit={onSubmit} style={authStyles.card}>
        <AuthHeader />
        <AuthCredentialFields />
        <AuthError />
        <AuthSubmitButton />
        <AuthModeToggle />
      </form>
    </div>
  );
}
