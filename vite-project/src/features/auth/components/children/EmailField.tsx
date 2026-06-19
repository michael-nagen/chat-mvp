import { TextField } from '../../../../shared/components/TextField';
import { useAuthScreenContext } from '../../AuthScreen.context';

export function EmailField(): React.JSX.Element {
  const { email, onEmailChange, isLoading } = useAuthScreenContext();
  return (
    <TextField
      type="email"
      value={email}
      onChange={onEmailChange}
      placeholder="Email"
      autoComplete="email"
      disabled={isLoading}
      autoFocus
    />
  );
}
