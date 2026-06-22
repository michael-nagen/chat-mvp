import { profileStyles } from '../shared/Profile.styles';
import { avatarStyles } from './ProfileAvatarView.styles';
import { profileStrings } from '../profile.strings';
import { ProfileAvatarImage } from './children/ProfileAvatarImage';
import { ProfileAvatarUploadButton } from './children/ProfileAvatarUploadButton';
import { ProfileAvatarRemoveButton } from './children/ProfileAvatarRemoveButton';
import { ProfileAvatarFileInput } from './children/ProfileAvatarFileInput';
import { ProfileAvatarError } from './children/ProfileAvatarError';

/** Composes the photo section; children read their own data from the avatar context. */
export function ProfileAvatarView(): React.JSX.Element {
  return (
    <section style={profileStyles.section}>
      <h2 style={profileStyles.sectionTitle}>{profileStrings.sections.photo}</h2>
      <div style={avatarStyles.avatarRow}>
        <ProfileAvatarImage />
        <div style={avatarStyles.avatarActions}>
          <ProfileAvatarUploadButton />
          <ProfileAvatarRemoveButton />
        </div>
        <ProfileAvatarFileInput />
      </div>
      <ProfileAvatarError />
    </section>
  );
}
