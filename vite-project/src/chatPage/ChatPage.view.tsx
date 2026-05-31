import type { ChatPageViewProps } from './ChatPage.types';
import { ConversationList } from '../conversationList';
import { MessageList } from '../messageList';
import { MessageComposer } from '../messageComposer';
import { Toast } from '../toast';

/** Renders the two-panel chat layout: conversation sidebar on the left, message thread and composer on the right. */
export function ChatPageView({
  conversationListProps,
  messageListProps,
  composerProps,
  toastProps,
  currentUserName,
}: ChatPageViewProps) {
  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "sans-serif" }}>

      {/* Left — conversation list */}
      <div style={{ width: "260px", borderRight: "1px solid #eee", display: "flex", flexDirection: "column" }}>
        <div
          style={{
            padding: "12px 16px",
            borderBottom: "1px solid #eee",
            fontWeight: 600,
          }}
        >
          {currentUserName}
        </div>
        <div style={{ flex: 1, overflowY: "auto" }}>
          <ConversationList {...conversationListProps} />
        </div>
      </div>

      {/* Right — messages + composer */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <MessageList {...messageListProps} />
        <MessageComposer {...composerProps} />
      </div>

      <Toast {...toastProps} />

    </div>
  );
}
