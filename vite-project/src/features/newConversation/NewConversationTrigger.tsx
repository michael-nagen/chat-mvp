import { chatPageStyles } from '../chatPage/components/ChatPage.styles';
import { useNewConversation } from './NewConversation.context';

/** Collapsed control that reveals the new-conversation form. */
export function NewConversationTrigger(): React.JSX.Element {
  const { open } = useNewConversation();

  return (
    <button type="button" onClick={open} style={chatPageStyles.newButton}>
      + New conversation
    </button>
  );
}
