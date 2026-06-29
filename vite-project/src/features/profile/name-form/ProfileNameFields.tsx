import { ContextField } from '../../../shared/components/ContextField';
import { profileStyles } from '../shared/Profile.styles';
import { profileStrings } from '../profile.strings';
import { useProfileNameFormContext } from './ProfileNameForm.context';

/** Groups the name inputs; each field reads its own slice from the form context. */
export function ProfileNameFields(): React.JSX.Element {
  return (
    <>
      <ContextField
        useFieldContext={useProfileNameFormContext}
        select={(c) => ({
          value: c.firstName,
          onChange: c.onFirstNameChange,
          disabled: c.isSaving,
        })}
        type="text"
        placeholder={profileStrings.fields.firstName}
        autoComplete="given-name"
        style={profileStyles.input}
      />
      <ContextField
        useFieldContext={useProfileNameFormContext}
        select={(c) => ({
          value: c.lastName,
          onChange: c.onLastNameChange,
          disabled: c.isSaving,
        })}
        type="text"
        placeholder={profileStrings.fields.lastName}
        autoComplete="family-name"
        style={profileStyles.input}
      />
    </>
  );
}
