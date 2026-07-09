import { Modal } from '../../../shared/components/Modal';
import { useNewConversation } from '../NewConversation.context';
import { ContactsProvider } from '../ContactsProvider';
import { newConversationStrings } from '../NewConversation.strings';
import { SelectParticipantsStep } from './SelectParticipantsStep';
import { GroupTitleStep } from './GroupTitleStep';
import { AssistantStep } from './AssistantStep';


export function NewConversationModal(): React.JSX.Element {
  const { mode, step, cancel } = useNewConversation();

  return (
    <Modal title={newConversationStrings.title} onClose={cancel}>
      {mode === 'assistant' ? (
        <AssistantStep />
      ) : (
        <ContactsProvider>
          {step === 'groupTitle' ? <GroupTitleStep /> : <SelectParticipantsStep />}
        </ContactsProvider>
      )}
    </Modal>
  );
}
