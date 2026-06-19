import { useProfileEmailForm } from './ProfileEmailForm.use';
import { ProfileEmailFormContext } from './ProfileEmailForm.context';
import { ProfileEmailFormView } from './ProfileEmailFormView';

/** Email form with its own save action. */
export function ProfileEmailForm(): React.JSX.Element {
  const value = useProfileEmailForm();

  return (
    <ProfileEmailFormContext.Provider value={value}>
      <ProfileEmailFormView />
    </ProfileEmailFormContext.Provider>
  );
}
