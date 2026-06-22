import { useContactRow } from './ContactRow.use';
import { ContactRowView } from './components/ContactRow.view';

/** Reads row state from context and feeds the pure row view. */
export function ContactRowContainer(): React.JSX.Element {
  const viewProps = useContactRow();

  return <ContactRowView {...viewProps} />;
}
