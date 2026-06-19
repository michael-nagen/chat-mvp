import { Avatar } from '../../../../shared/components/Avatar';
import { useProfileAvatarContext } from '../ProfileAvatar.context';

export function ProfileAvatarImage(): React.JSX.Element {
  const { avatarUrl, displayName } = useProfileAvatarContext();
  return <Avatar src={avatarUrl} name={displayName} size={64} />;
}
