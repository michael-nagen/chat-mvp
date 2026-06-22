import { avatarStyles } from '../ProfileAvatarView.styles';
import { ALLOWED_AVATAR_TYPES } from '../../model/Profile.constants';
import { useProfileAvatarContext } from '../ProfileAvatar.context';

export function ProfileAvatarFileInput(): React.JSX.Element {
  const { fileInputRef, onSelectFile } = useProfileAvatarContext();

  function onFileChange(event: React.ChangeEvent<HTMLInputElement>): void {
    const file = event.target.files?.[0];
    // Reset so selecting the same file again still fires onChange.
    event.target.value = '';
    if (file) void onSelectFile(file);
  }

  return (
    <input
      ref={fileInputRef}
      type="file"
      accept={ALLOWED_AVATAR_TYPES.join(',')}
      onChange={onFileChange}
      style={avatarStyles.hiddenFileInput}
    />
  );
}
