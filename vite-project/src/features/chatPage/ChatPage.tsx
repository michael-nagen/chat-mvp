import { ChatSelectionProvider } from './ChatSelectionProvider';
import { ChatPageView } from './components/ChatPage.view';
import { ToastProvider } from '../toast';
import { MessageThreadProvider } from '../messageThread';

/** Composes chat feature providers and renders the two-panel layout. */
export function ChatPage(): React.JSX.Element {
  return (
    <ChatSelectionProvider>
      <ToastProvider>
        <MessageThreadProvider>
          <ChatPageView />
        </MessageThreadProvider>
      </ToastProvider>
    </ChatSelectionProvider>
  );
}
