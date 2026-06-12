import { chatPageStyles } from './ChatPage.styles';
import { useAuth } from '../../auth';
import { ConversationList } from '../../conversationList';
import { MessageSearch } from '../../messageSearch';
import { NewConversation } from '../../newConversation/NewConversation';

/** Left pane — user header, new-conversation control, and the conversation list. */
export function ChatSidebar(): React.JSX.Element {
  const { user, logout } = useAuth();

  return (
    <div style={chatPageStyles.sidebar}>
      <div style={chatPageStyles.sidebarHeader}>
        <div style={chatPageStyles.sidebarHeaderRow}>
          <span style={chatPageStyles.sidebarEmail}>{user?.email}</span>
          <button type="button" onClick={logout} style={chatPageStyles.logoutButton}>
            Log out
          </button>
        </div>
      </div>
      <MessageSearch>
        <ConversationList />
      </MessageSearch>
      <div style={chatPageStyles.sidebarFooter}>
        <NewConversation />
      </div>
    </div>
  );
}
