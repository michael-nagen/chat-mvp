import { profileStyles } from '../shared/Profile.styles';
import { profileStrings } from '../profile.strings';
import { useProfileNameFormContext } from './ProfileNameForm.context';
import { ProfileNameFields } from './ProfileNameFields';
import { ProfileNameError } from './children/ProfileNameError';
import { ProfileNameSaveButton } from './children/ProfileNameSaveButton';

/** Composes the name section; children read their own data from the form context. */
export function ProfileNameFormView(): React.JSX.Element {
  const { onSubmit } = useProfileNameFormContext();

  return (
    <section style={profileStyles.section}>
      <h2 style={profileStyles.sectionTitle}>{profileStrings.sections.name}</h2>
      <form onSubmit={onSubmit} style={profileStyles.form}>
        <ProfileNameFields />
        <ProfileNameError />
        <ProfileNameSaveButton />
      </form>
    </section>
  );
}
