import { profileStyles } from '../../shared/Profile.styles';
import { useProfileAvatarContext } from '../ProfileAvatar.context';

export function ProfileAvatarError(): React.JSX.Element | false {
  const { error } = useProfileAvatarContext();
  return !!error && <span style={profileStyles.error}>{error}</span>;
}
