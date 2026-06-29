import { profileStyles } from '../../shared/Profile.styles';
import { useProfileNameFormContext } from '../ProfileNameForm.context';

export function ProfileNameError(): React.JSX.Element | null {
  const { error } = useProfileNameFormContext();
  if (!error) return null;
  return <span style={profileStyles.error}>{error}</span>;
}
