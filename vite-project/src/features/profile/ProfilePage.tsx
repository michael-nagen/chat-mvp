import { profilePageStyles } from './ProfilePage.styles';
import { ProfileHeader } from './ProfileHeader';
import { ProfileAvatar } from './avatar/ProfileAvatar';
import { ProfileNameForm } from './name-form/ProfileNameForm';
import { ProfileEmailForm } from './email-form/ProfileEmailForm';

/** Dedicated profile page: avatar manager plus the name and email forms. */
export function ProfilePage(): React.JSX.Element {
  return (
    <div style={profilePageStyles.root}>
      <div style={profilePageStyles.card}>
        <ProfileHeader />

        <ProfileAvatar />
        <ProfileNameForm />
        <ProfileEmailForm />
      </div>
    </div>
  );
}
