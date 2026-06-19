import { EmailField } from './children/EmailField';

/** Groups the email inputs; each child reads its own slice from the form context. */
export function ProfileEmailFields(): React.JSX.Element {
  return (
    <>
      <EmailField />
    </>
  );
}
