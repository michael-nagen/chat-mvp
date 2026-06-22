import { SecondaryButton } from '../../shared/SecondaryButton';
import { profileStrings } from '../../profile.strings';
import { useProfileAvatarContext } from '../ProfileAvatar.context';

export function ProfileAvatarUploadButton(): React.JSX.Element {
  const { isBusy, fileInputRef } = useProfileAvatarContext();
  return (
    <SecondaryButton
      label={isBusy ? profileStrings.avatar.working : profileStrings.avatar.upload}
      disabled={isBusy}
      onClick={() => fileInputRef.current?.click()}
    />
  );
}
