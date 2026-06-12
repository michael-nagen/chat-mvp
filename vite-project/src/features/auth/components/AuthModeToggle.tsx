import { authStyles } from './Auth.styles';
import { useAuthScreenContext } from '../AuthScreen.context';

/** Footer button that switches between login and signup modes. */
export function AuthModeToggle(): React.JSX.Element {
  const { mode, onToggleMode } = useAuthScreenContext();
  return (
    <button type="button" onClick={onToggleMode} style={authStyles.toggle}>
      {mode === 'login'
        ? "Don't have an account? Sign up"
        : 'Already have an account? Log in'}
    </button>
  );
}
