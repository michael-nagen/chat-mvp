import { NewConversationProvider } from './NewConversationProvider';
import { NewConversationView } from './NewConversation.view';

/** Sidebar control that opens the New Conversation modal (DM or group). */
export function NewConversation(): React.JSX.Element {
  return (
    <NewConversationProvider>
      <NewConversationView />
    </NewConversationProvider>
  );
}
