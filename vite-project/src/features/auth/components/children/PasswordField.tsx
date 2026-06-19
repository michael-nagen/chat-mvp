import { TextField } from '../../../../shared/components/TextField';
import { useAuthScreenContext } from '../../AuthScreen.context';

export function PasswordField(): React.JSX.Element {
  const { password, onPasswordChange, isLoading } = useAuthScreenContext();
  return (
    <TextField
      type="password"
      value={password}
      onChange={onPasswordChange}
      placeholder="Password"
      autoComplete="current-password"
      disabled={isLoading}
    />
  );
}
