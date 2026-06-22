import { profileStyles } from '../../shared/Profile.styles';
import { profileStrings } from '../../profile.strings';
import { useProfileNameFormContext } from '../ProfileNameForm.context';

/** Submit button that reflects the name form's saving + submittable state. */
export function ProfileNameSaveButton(): React.JSX.Element {
  const { isSaving, submittable } = useProfileNameFormContext();
  return (
    <button type="submit" disabled={!submittable} style={profileStyles.button(submittable)}>
      {isSaving ? profileStrings.name.saving : profileStrings.name.save}
    </button>
  );
}
