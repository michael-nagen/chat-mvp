import { authStyles } from './Auth.styles';
import { authStrings } from '../auth.strings';
import { useAuthScreenContext } from '../AuthScreen.context';

/** Footer button that switches between login and signup modes. */
export function AuthModeToggle(): React.JSX.Element {
  const { mode, onToggleMode } = useAuthScreenContext();
  return (
    <button type="button" onClick={onToggleMode} style={authStyles.toggle}>
      {authStrings.toggle[mode]}
    </button>
  );
}
