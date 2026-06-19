import { TextField } from '../../../../shared/components/TextField';
import { profileStyles } from '../../shared/Profile.styles';
import { useProfileNameFormContext } from '../ProfileNameForm.context';

export function LastNameField(): React.JSX.Element {
  const { lastName, onLastNameChange, isSaving } = useProfileNameFormContext();
  return (
    <TextField
      type="text"
      value={lastName}
      onChange={onLastNameChange}
      placeholder="Last name"
      autoComplete="family-name"
      disabled={isSaving}
      style={profileStyles.input}
    />
  );
}
