import { Modal } from '../../../shared/components/Modal';
import { useNewConversation } from '../NewConversation.context';
import { ContactsProvider } from '../ContactsProvider';
import { newConversationStrings } from '../NewConversation.strings';
import { SelectParticipantsStep } from './SelectParticipantsStep';
import { GroupTitleStep } from './GroupTitleStep';

/** Modal shell; renders the active step. Contacts load once for both steps. */
export function NewConversationModal(): React.JSX.Element {
  const { step, cancel } = useNewConversation();

  return (
    <Modal title={newConversationStrings.title} onClose={cancel}>
      <ContactsProvider>
        {step === 'groupTitle' ? <GroupTitleStep /> : <SelectParticipantsStep />}
      </ContactsProvider>
    </Modal>
  );
}
