import { chatPageStyles } from '../chatPage/components/ChatPage.styles';
import { useNewConversation } from './NewConversation.context';

/** Submit button for the new-conversation form. */
export function NewConversationSubmit(): React.JSX.Element {
  const { submittable, isCreating } = useNewConversation();

  return (
    <button type="submit" disabled={!submittable} style={chatPageStyles.newSubmit(submittable)}>
      {isCreating ? '...' : 'Add'}
    </button>
  );
}
