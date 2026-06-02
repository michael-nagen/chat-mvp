import { useAuth } from "../auth";
import { chatPageStyles } from "./ChatPage.styles";
import { ConversationList } from "../conversationList";
import { MessageList } from "../messageList";
import { MessageComposer } from "../messageComposer";
import { Toast } from "../toast";

/** Top-level chat layout — renders the four self-contained panes with no prop drilling. */
export function ChatPageView(): React.JSX.Element {
  const { user } = useAuth();

  return (
    <div style={chatPageStyles.root}>

      {/* Left — conversation list */}
      <div style={chatPageStyles.sidebar}>
        <div style={chatPageStyles.sidebarHeader}>{user?.name}</div>
        <div style={chatPageStyles.sidebarScroll}>
          <ConversationList />
        </div>
      </div>

      {/* Right — messages + composer */}
      <div style={chatPageStyles.main}>
        <MessageList />
        <MessageComposer />
      </div>

      <Toast />

    </div>
  );
}
