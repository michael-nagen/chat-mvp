import { TextField } from '../../../../shared/components/TextField';
import { profileStyles } from '../../shared/Profile.styles';
import { useProfileEmailFormContext } from '../ProfileEmailForm.context';

export function EmailField(): React.JSX.Element {
  const { email, onEmailChange, isSaving } = useProfileEmailFormContext();
  return (
    <TextField
      type="email"
      value={email}
      onChange={onEmailChange}
      placeholder="Email"
      autoComplete="email"
      disabled={isSaving}
      style={profileStyles.input}
    />
  );
}
