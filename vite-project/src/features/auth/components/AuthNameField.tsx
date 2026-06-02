import type { AuthNameFieldProps } from '../Auth.types';
import { authStyles } from './Auth.styles';

/** Controlled name input for the login form. */
export function AuthNameField(props: AuthNameFieldProps): React.JSX.Element {
  return (
    <input
      type="text"
      value={props.name}
      onChange={(e) => props.onNameChange(e.target.value)}
      placeholder="Your name"
      autoFocus
      disabled={props.isLoading}
      style={authStyles.input}
    />
  );
}
