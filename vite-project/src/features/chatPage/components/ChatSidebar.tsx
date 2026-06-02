import { chatPageStyles } from './ChatPage.styles';
import type { ChatSidebarProps } from '../ChatPage.types';
import { ConversationList } from '../../conversationList';

/** Left pane — user header and the conversation list. */
export function ChatSidebar({ userName }: ChatSidebarProps): React.JSX.Element {
  return (
    <div style={chatPageStyles.sidebar}>
      <div style={chatPageStyles.sidebarHeader}>{userName}</div>
      <div style={chatPageStyles.sidebarScroll}>
        <ConversationList />
      </div>
    </div>
  );
}
