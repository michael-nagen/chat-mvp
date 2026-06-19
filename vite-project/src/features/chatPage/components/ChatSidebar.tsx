import { chatPageStyles } from './ChatPage.styles';
import { ConversationList } from '../../conversationList';
import { MessageSearch } from '../../messageSearch';
import { NewConversation } from '../../newConversation/NewConversation';
import { ProfileLink } from './children/ProfileLink';
import { LogoutButton } from './children/LogoutButton';

/** Left pane — user header, new-conversation control, and the conversation list. */
export function ChatSidebar(): React.JSX.Element {
  return (
    <div style={chatPageStyles.sidebar}>
      <div style={chatPageStyles.sidebarHeader}>
        <div style={chatPageStyles.sidebarHeaderRow}>
          <ProfileLink />
          <LogoutButton />
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
