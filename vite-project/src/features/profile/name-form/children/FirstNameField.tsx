import { TextField } from '../../../../shared/components/TextField';
import { profileStyles } from '../../shared/Profile.styles';
import { useProfileNameFormContext } from '../ProfileNameForm.context';

export function FirstNameField(): React.JSX.Element {
  const { firstName, onFirstNameChange, isSaving } = useProfileNameFormContext();
  return (
    <TextField
      type="text"
      value={firstName}
      onChange={onFirstNameChange}
      placeholder="First name"
      autoComplete="given-name"
      disabled={isSaving}
      style={profileStyles.input}
    />
  );
}
