import { authStyles } from './Auth.styles';
import { useAuthScreenContext } from '../AuthScreen.context';

/** Submit button that reflects loading, submittable, and mode state. */
export function AuthSubmitButton(): React.JSX.Element {
  const { mode, submittable, isLoading } = useAuthScreenContext();
  const idle = mode === 'login' ? 'Log in' : 'Create account';
  const busy = mode === 'login' ? 'Logging in...' : 'Creating account...';
  return (
    <button type="submit" disabled={!submittable} style={authStyles.button(submittable)}>
      {isLoading ? busy : idle}
    </button>
  );
}
