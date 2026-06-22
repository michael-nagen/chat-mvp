import { profileStyles } from '../../shared/Profile.styles';
import { profileStrings } from '../../profile.strings';
import { useProfileEmailFormContext } from '../ProfileEmailForm.context';

/** Submit button that reflects the email form's saving + submittable state. */
export function ProfileEmailSaveButton(): React.JSX.Element {
  const { isSaving, submittable } = useProfileEmailFormContext();
  return (
    <button type="submit" disabled={!submittable} style={profileStyles.button(submittable)}>
      {isSaving ? profileStrings.email.saving : profileStrings.email.save}
    </button>
  );
}
