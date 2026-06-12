import { chatPageStyles } from '../chatPage/components/ChatPage.styles';
import { useNewConversation } from './NewConversation.context';
import { NewConversationTrigger } from './NewConversationTrigger';
import { NewConversationInput } from './NewConversationInput';
import { NewConversationSubmit } from './NewConversationSubmit';

/** Composes the new-conversation controls: trigger when collapsed, form when open. */
export function NewConversationView(): React.JSX.Element {
  const { isOpen, onSubmit } = useNewConversation();

  return isOpen ? (
    <form onSubmit={(e) => void onSubmit(e)} style={chatPageStyles.newForm}>
      <NewConversationInput />
      <NewConversationSubmit />
    </form>
  ) : (
    <NewConversationTrigger />
  );
}
