import { ContextField } from '../../../shared/components/ContextField';
import { authStrings } from '../auth.strings';
import { useAuthScreenContext } from '../AuthScreen.context';

/** Controlled email + password inputs shared by the login and signup modes. */
export function AuthCredentialFields(): React.JSX.Element {
  const { mode } = useAuthScreenContext();
  return (
    <>
      <ContextField
        useFieldContext={useAuthScreenContext}
        select={(c) => ({
          value: c.email,
          onChange: c.onEmailChange,
          disabled: c.isLoading,
        })}
        type="email"
        placeholder={authStrings.fields.email}
        autoComplete="email"
        autoFocus
      />
      {mode === 'signup' && (
        <>
          <ContextField
            useFieldContext={useAuthScreenContext}
            select={(c) => ({
              value: c.firstName,
              onChange: c.onFirstNameChange,
              disabled: c.isLoading,
            })}
            type="text"
            placeholder={authStrings.fields.firstName}
            autoComplete="given-name"
          />
          <ContextField
            useFieldContext={useAuthScreenContext}
            select={(c) => ({
              value: c.lastName,
              onChange: c.onLastNameChange,
              disabled: c.isLoading,
            })}
            type="text"
            placeholder={authStrings.fields.lastName}
            autoComplete="family-name"
          />
        </>
      )}
      <ContextField
        useFieldContext={useAuthScreenContext}
        select={(c) => ({
          value: c.password,
          onChange: c.onPasswordChange,
          disabled: c.isLoading,
        })}
        type="password"
        placeholder={authStrings.fields.password}
        autoComplete="current-password"
      />
    </>
  );
}
