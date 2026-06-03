import { chatPageStyles } from './ChatPage.styles';
import { useAuth } from '../../auth';
import { ConversationList } from '../../conversationList';

/** Left pane — user header and the conversation list. */
export function ChatSidebar(): React.JSX.Element {
  const { user } = useAuth();

  return (
    <div style={chatPageStyles.sidebar}>
      <div style={chatPageStyles.sidebarHeader}>{user?.name}</div>
      <div style={chatPageStyles.sidebarScroll}>
        <ConversationList />
      </div>
    </div>
  );
}
