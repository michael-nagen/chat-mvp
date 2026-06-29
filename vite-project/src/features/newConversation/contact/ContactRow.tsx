import { ContactRowProvider } from './ContactRowProvider';
import { ContactRowContainer } from './ContactRowContainer';
import type { ContactRowProps } from './ContactRow.types';

export function ContactRow({ contact }: ContactRowProps): React.JSX.Element {
  return (
    <ContactRowProvider contact={contact}>
      <ContactRowContainer />
    </ContactRowProvider>
  );
}
