import { ChatProvider } from "./ChatContext";
import { ChatPageView } from "./ChatPage.view";

/** Provides shared chat state and renders the two-panel layout. */
export function ChatPage(): React.JSX.Element {
  return (
    <ChatProvider>
      <ChatPageView />
    </ChatProvider>
  );
}
