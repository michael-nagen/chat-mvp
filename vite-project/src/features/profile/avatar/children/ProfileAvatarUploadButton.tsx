import { SecondaryButton } from '../../shared/SecondaryButton';
import { useProfileAvatarContext } from '../ProfileAvatar.context';

export function ProfileAvatarUploadButton(): React.JSX.Element {
  const { isBusy, fileInputRef } = useProfileAvatarContext();
  return (
    <SecondaryButton
      label={isBusy ? 'Working...' : 'Upload new photo'}
      disabled={isBusy}
      onClick={() => fileInputRef.current?.click()}
    />
  );
}
