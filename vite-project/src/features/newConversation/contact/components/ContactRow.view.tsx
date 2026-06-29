import { Avatar } from '../../../../shared/components/Avatar';
import type { ContactRowViewProps } from '../ContactRow.types';
import { contactRowStyles } from './ContactRow.styles';

/** A single selectable contact row — avatar, name, and a checkmark when selected. */
export function ContactRowView({
  contact,
  isSelected,
  onToggle,
}: ContactRowViewProps): React.JSX.Element {
  return (
    <div onClick={onToggle} style={contactRowStyles.row(isSelected)}>
      <Avatar src={contact.avatarUrl} name={contact.displayName} size={32} />
      <span style={contactRowStyles.name}>{contact.displayName}</span>
      {isSelected && <span style={contactRowStyles.check}>✓</span>}
    </div>
  );
}
