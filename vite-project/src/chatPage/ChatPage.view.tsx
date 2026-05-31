import { useAuth } from "../auth";
import { BORDER_COLOR, SIDEBAR_WIDTH } from "./ChatPage.constants";
import { ConversationList } from "../conversationList";
import { MessageList } from "../messageList";
import { MessageComposer } from "../messageComposer";
import { Toast } from "../toast";

/** Top-level chat layout — renders the four self-contained panes with no prop drilling. */
export function ChatPageView(): React.JSX.Element {
  const { user } = useAuth();

  return (
    <div style={styles.root}>

      {/* Left — conversation list */}
      <div style={styles.sidebar}>
        <div style={styles.sidebarHeader}>{user?.name}</div>
        <div style={styles.sidebarScroll}>
          <ConversationList />
        </div>
      </div>

      {/* Right — messages + composer */}
      <div style={styles.main}>
        <MessageList />
        <MessageComposer />
      </div>

      <Toast />

    </div>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = {
  root: {
    display: "flex",
    height: "100vh",
    fontFamily: "sans-serif",
  },
  sidebar: {
    width: SIDEBAR_WIDTH,
    borderRight: `1px solid ${BORDER_COLOR}`,
    display: "flex",
    flexDirection: "column" as const,
  },
  sidebarHeader: {
    padding: "12px 16px",
    borderBottom: `1px solid ${BORDER_COLOR}`,
    fontWeight: 600,
  },
  sidebarScroll: {
    flex: 1,
    overflowY: "auto" as const,
  },
  main: {
    flex: 1,
    display: "flex",
    flexDirection: "column" as const,
  },
};
