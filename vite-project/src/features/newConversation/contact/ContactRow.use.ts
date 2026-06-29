import { useContactRowContext } from './ContactRow.context';
import { useNewConversation } from '../NewConversation.context';
import type { ContactRowViewProps } from './ContactRow.types';

export function useContactRow(): ContactRowViewProps {
  const { contact } = useContactRowContext();
  const { selectedContactIds, toggleContact } = useNewConversation();

  return {
    contact,
    isSelected: selectedContactIds.includes(contact.id),
    onToggle: () => toggleContact(contact.id),
  };
}
