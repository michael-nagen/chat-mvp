import { TextField } from '../../../../shared/components/TextField';
import { useAuthScreenContext } from '../../AuthScreen.context';

export function FirstNameField(): React.JSX.Element {
  const { firstName, onFirstNameChange, isLoading } = useAuthScreenContext();
  return (
    <TextField
      type="text"
      value={firstName}
      onChange={onFirstNameChange}
      placeholder="First name"
      autoComplete="given-name"
      disabled={isLoading}
    />
  );
}
