import { ChatSelectionProvider } from "./ChatSelectionProvider";
import { ChatPageView } from "./ChatPage.view";
import { ToastProvider } from "../toast";
import { MessageThreadProvider } from "../messageList/MessageThreadProvider";

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
