import { profileStyles } from '../shared/Profile.styles';
import { profileStrings } from '../profile.strings';
import { useProfileEmailFormContext } from './ProfileEmailForm.context';
import { ProfileEmailFields } from './ProfileEmailFields';
import { ProfileEmailError } from './children/ProfileEmailError';
import { ProfileEmailSaveButton } from './children/ProfileEmailSaveButton';

/** Composes the email section; children read their own data from the form context. */
export function ProfileEmailFormView(): React.JSX.Element {
  const { onSubmit } = useProfileEmailFormContext();

  return (
    <section style={profileStyles.section}>
      <h2 style={profileStyles.sectionTitle}>{profileStrings.sections.email}</h2>
      <form onSubmit={onSubmit} style={profileStyles.form}>
        <ProfileEmailFields />
        <ProfileEmailError />
        <ProfileEmailSaveButton />
      </form>
    </section>
  );
}
