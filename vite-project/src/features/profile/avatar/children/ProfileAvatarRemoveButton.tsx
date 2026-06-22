import { SecondaryButton } from '../../shared/SecondaryButton';
import { profileStrings } from '../../profile.strings';
import { useProfileAvatarContext } from '../ProfileAvatar.context';

export function ProfileAvatarRemoveButton(): React.JSX.Element | false {
  const { hasAvatar, isBusy, onRemove } = useProfileAvatarContext();
  return (
    hasAvatar && (
      <SecondaryButton
        label={profileStrings.avatar.remove}
        disabled={isBusy}
        onClick={() => void onRemove()}
      />
    )
  );
}
