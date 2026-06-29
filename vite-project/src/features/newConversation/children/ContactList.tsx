import { useContactsContext } from '../Contacts.context';
import { ContactRow } from '../contact/ContactRow';
import { newConversationStrings } from '../NewConversation.strings';
import { newConversationStyles } from '../NewConversation.styles';

/** The contacts list; one selectable row per contact. */
export function ContactList(): React.JSX.Element {
  const { contacts, isLoading, error } = useContactsContext();

  return isLoading ? (
    <div style={newConversationStyles.notice}>
      {newConversationStrings.loading}
    </div>
  ) : error ? (
    <div style={newConversationStyles.error}>{error}</div>
  ) : contacts.length === 0 ? (
    <div style={newConversationStyles.notice}>
      {newConversationStrings.empty}
    </div>
  ) : (
    <div style={newConversationStyles.list}>
      {contacts.map((contact) => (
        <ContactRow key={contact.id} contact={contact} />
      ))}
    </div>
  );
}
