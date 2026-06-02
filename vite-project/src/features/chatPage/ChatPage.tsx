import { ChatSelectionProvider } from './ChatSelectionProvider';
import { ChatPageView } from './components/ChatPage.view';
import { useChatPage } from './ChatPage.use';
import { ToastProvider } from '../toast';
import { MessageThreadProvider } from '../messageList/MessageThreadProvider';

/** Composes chat feature providers and renders the two-panel layout. */
export function ChatPage(): React.JSX.Element {
  const viewProps = useChatPage();

  return (
    <ChatSelectionProvider>
      <ToastProvider>
        <MessageThreadProvider>
          <ChatPageView {...viewProps} />
        </MessageThreadProvider>
      </ToastProvider>
    </ChatSelectionProvider>
  );
}
