import { authStyles } from './Auth.styles';
import { authStrings } from '../auth.strings';
import { useAuthScreenContext } from '../AuthScreen.context';

/** Submit button that reflects loading, submittable, and mode state. */
export function AuthSubmitButton(): React.JSX.Element {
  const { mode, submittable, isLoading } = useAuthScreenContext();
  return (
    <button type="submit" disabled={!submittable} style={authStyles.button(submittable)}>
      {isLoading ? authStrings.submit.busy[mode] : authStrings.submit.idle[mode]}
    </button>
  );
}
