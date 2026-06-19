import { profileStyles } from './shared/Profile.styles';
import { ProfileHeader } from './ProfileHeader';
import { ProfileAvatar } from './avatar/ProfileAvatar';
import { ProfileNameForm } from './name-form/ProfileNameForm';
import { ProfileEmailForm } from './email-form/ProfileEmailForm';

/** Dedicated profile page: avatar manager plus the name and email forms. */
export function ProfilePage(): React.JSX.Element {
  return (
    <div style={profileStyles.root}>
      <div style={profileStyles.card}>
        <ProfileHeader />

        <ProfileAvatar />
        <ProfileNameForm />
        <ProfileEmailForm />
      </div>
    </div>
  );
}
