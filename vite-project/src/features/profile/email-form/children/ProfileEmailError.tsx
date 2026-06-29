import { profileStyles } from '../../shared/Profile.styles';
import { useProfileEmailFormContext } from '../ProfileEmailForm.context';

export function ProfileEmailError(): React.JSX.Element | null {
  const { error } = useProfileEmailFormContext();
  if (!error) return null;
  return <span style={profileStyles.error}>{error}</span>;
}
