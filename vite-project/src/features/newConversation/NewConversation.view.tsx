import { useNewConversation } from './NewConversation.context';
import { NewConversationTrigger } from './NewConversationTrigger';
import { NewConversationModal } from './children/NewConversationModal';

/** Trigger lives in the sidebar; the modal overlays the screen when open. */
export function NewConversationView(): React.JSX.Element {
  const { isOpen } = useNewConversation();

  return (
    <>
      <NewConversationTrigger />
      {isOpen && <NewConversationModal />}
    </>
  );
}
