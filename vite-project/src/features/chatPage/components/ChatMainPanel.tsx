import { chatPageStyles } from './ChatPage.styles';
import { ChatHeader } from './ChatHeader';
import { MessageList } from '../../messageList';
import { MessageComposer } from '../../messageComposer';

/** Right pane — conversation header, message thread, and composer. */
export function ChatMainPanel(): React.JSX.Element {
  return (
    <div style={chatPageStyles.main}>
      <ChatHeader />
      <MessageList />
      <MessageComposer />
    </div>
  );
}
