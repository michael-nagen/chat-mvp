import { FirstNameField } from './children/FirstNameField';
import { LastNameField } from './children/LastNameField';

/** Groups the name inputs; each child reads its own slice from the form context. */
export function ProfileNameFields(): React.JSX.Element {
  return (
    <>
      <FirstNameField />
      <LastNameField />
    </>
  );
}
