import { ChatProvider } from "./ChatContext";
import { ChatPageView } from "./ChatPage.view";

/** Provides shared chat state and renders the two-panel layout. */
export function ChatPage() {
  return (
    <ChatProvider>
      <ChatPageView />
    </ChatProvider>
  );
}
