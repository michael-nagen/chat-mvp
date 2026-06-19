import { TextField } from '../../../../shared/components/TextField';
import { useAuthScreenContext } from '../../AuthScreen.context';

export function LastNameField(): React.JSX.Element {
  const { lastName, onLastNameChange, isLoading } = useAuthScreenContext();
  return (
    <TextField
      type="text"
      value={lastName}
      onChange={onLastNameChange}
      placeholder="Last name"
      autoComplete="family-name"
      disabled={isLoading}
    />
  );
}
