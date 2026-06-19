import { profileStyles } from '../shared/Profile.styles';
import { ProfileAvatarImage } from './children/ProfileAvatarImage';
import { ProfileAvatarUploadButton } from './children/ProfileAvatarUploadButton';
import { ProfileAvatarRemoveButton } from './children/ProfileAvatarRemoveButton';
import { ProfileAvatarFileInput } from './children/ProfileAvatarFileInput';
import { ProfileAvatarError } from './children/ProfileAvatarError';

/** Composes the photo section; children read their own data from the avatar context. */
export function ProfileAvatarView(): React.JSX.Element {
  return (
    <section style={profileStyles.section}>
      <h2 style={profileStyles.sectionTitle}>Photo</h2>
      <div style={profileStyles.avatarRow}>
        <ProfileAvatarImage />
        <div style={profileStyles.avatarActions}>
          <ProfileAvatarUploadButton />
          <ProfileAvatarRemoveButton />
        </div>
        <ProfileAvatarFileInput />
      </div>
      <ProfileAvatarError />
    </section>
  );
}
