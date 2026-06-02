import type { AuthSubmitButtonProps } from '../Auth.types';
import { authStyles } from './Auth.styles';

/** Submit button that reflects loading and submittable state. */
export function AuthSubmitButton(props: AuthSubmitButtonProps): React.JSX.Element {
  return (
    <button type="submit" disabled={!props.submittable} style={authStyles.button(props.submittable)}>
      {props.isLoading ? 'Logging in...' : 'Log in'}
    </button>
  );
}
