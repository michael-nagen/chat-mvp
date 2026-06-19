import { useAuthScreenContext } from '../AuthScreen.context';
import { EmailField } from './children/EmailField';
import { FirstNameField } from './children/FirstNameField';
import { LastNameField } from './children/LastNameField';
import { PasswordField } from './children/PasswordField';

/** Controlled email + password inputs shared by the login and signup modes. */
export function AuthCredentialFields(): React.JSX.Element {
  const { mode } = useAuthScreenContext();
  return (
    <>
      <EmailField />
      {mode === 'signup' && (
        <>
          <FirstNameField />
          <LastNameField />
        </>
      )}
      <PasswordField />
    </>
  );
}
