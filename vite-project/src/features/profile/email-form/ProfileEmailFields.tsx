import { ContextField } from '../../../shared/components/ContextField';
import { profileStyles } from '../shared/Profile.styles';
import { profileStrings } from '../profile.strings';
import { useProfileEmailFormContext } from './ProfileEmailForm.context';

/** The email input; reads its own slice from the form context. */
export function ProfileEmailFields(): React.JSX.Element {
  return (
    <ContextField
      useFieldContext={useProfileEmailFormContext}
      select={(c) => ({
        value: c.email,
        onChange: c.onEmailChange,
        disabled: c.isSaving,
      })}
      type="email"
      placeholder={profileStrings.fields.email}
      autoComplete="email"
      style={profileStyles.input}
    />
  );
}
