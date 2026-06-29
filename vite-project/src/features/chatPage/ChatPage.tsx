import { ChatSelectionProvider } from './ChatSelectionProvider';
import { ChatParticipantsProvider } from './ChatParticipantsProvider';
import { ChatPageView } from './components/ChatPage.view';
import { MessageThreadProvider } from '../messageThread';

/** Composes chat feature providers and renders the two-panel layout.
 *  Toast is provided globally (see App), so it is not wrapped here. */
export function ChatPage(): React.JSX.Element {
  return (
    <ChatSelectionProvider>
      <ChatParticipantsProvider>
        <MessageThreadProvider>
          <ChatPageView />
        </MessageThreadProvider>
      </ChatParticipantsProvider>
    </ChatSelectionProvider>
  );
}
