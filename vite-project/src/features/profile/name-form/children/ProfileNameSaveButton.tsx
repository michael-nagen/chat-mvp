import { profileStyles } from '../../shared/Profile.styles';
import { useProfileNameFormContext } from '../ProfileNameForm.context';

/** Submit button that reflects the name form's saving + submittable state. */
export function ProfileNameSaveButton(): React.JSX.Element {
  const { isSaving, submittable } = useProfileNameFormContext();
  return (
    <button type="submit" disabled={!submittable} style={profileStyles.button(submittable)}>
      {isSaving ? 'Saving...' : 'Save name'}
    </button>
  );
}
