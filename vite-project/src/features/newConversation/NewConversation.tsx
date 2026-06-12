import { NewConversationProvider } from './NewConversationProvider';
import { NewConversationView } from './NewConversation.view';

/** Sidebar control to start a conversation with a recipient by email. */
export function NewConversation(): React.JSX.Element {
  return (
    <NewConversationProvider>
      <NewConversationView />
    </NewConversationProvider>
  );
}
