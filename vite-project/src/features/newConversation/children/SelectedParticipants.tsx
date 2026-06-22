import { Avatar } from '../../../shared/components/Avatar';
import { useNewConversation } from '../NewConversation.context';
import { useContactsContext } from '../Contacts.context';
import { newConversationStyles } from '../NewConversation.styles';

/** Read-only summary of the contacts the group will include. */
export function SelectedParticipants(): React.JSX.Element {
  const { selectedContactIds } = useNewConversation();
  const { contacts } = useContactsContext();
  const selected = contacts.filter((contact) =>
    selectedContactIds.includes(contact.id),
  );

  return (
    <div style={newConversationStyles.selectedRow}>
      {selected.map((contact) => (
        <span key={contact.id} style={newConversationStyles.selectedChip}>
          <Avatar src={contact.avatarUrl} name={contact.displayName} size={24} />
          {contact.displayName}
        </span>
      ))}
    </div>
  );
}
