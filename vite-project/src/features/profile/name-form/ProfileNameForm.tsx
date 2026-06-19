import { useProfileNameForm } from './ProfileNameForm.use';
import { ProfileNameFormContext } from './ProfileNameForm.context';
import { ProfileNameFormView } from './ProfileNameFormView';

/** First/last name form with its own save action. */
export function ProfileNameForm(): React.JSX.Element {
  const value = useProfileNameForm();

  return (
    <ProfileNameFormContext.Provider value={value}>
      <ProfileNameFormView />
    </ProfileNameFormContext.Provider>
  );
}
