import { profileStyles } from '../../shared/Profile.styles';
import { useProfileAvatarContext } from '../ProfileAvatar.context';

export function ProfileAvatarError(): React.JSX.Element | null {
  const { error } = useProfileAvatarContext();
  if (!error) return null;
  return <span style={profileStyles.error}>{error}</span>;
}
