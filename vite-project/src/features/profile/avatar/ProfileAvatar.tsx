import { useProfileAvatar } from './ProfileAvatar.use';
import { ProfileAvatarContext } from './ProfileAvatar.context';
import { ProfileAvatarView } from './ProfileAvatarView';

/** Avatar manager: provides upload/remove state to its children. */
export function ProfileAvatar(): React.JSX.Element {
  const value = useProfileAvatar();

  return (
    <ProfileAvatarContext.Provider value={value}>
      <ProfileAvatarView />
    </ProfileAvatarContext.Provider>
  );
}
