import { authStyles } from './Auth.styles';
import { useAuthScreenContext } from '../AuthScreen.context';

/** Title and hint shown at the top of the auth card, reflecting the active mode. */
export function AuthHeader(): React.JSX.Element {
  const { mode } = useAuthScreenContext();
  return (
    <>
      <h2 style={authStyles.title}>{mode === 'login' ? 'Log in' : 'Create account'}</h2>
      <p style={authStyles.hint}>
        {mode === 'login'
          ? 'Sign in with your email and password (try alice@example.com / password).'
          : 'Register with your email and a password of at least 6 characters.'}
      </p>
    </>
  );
}
