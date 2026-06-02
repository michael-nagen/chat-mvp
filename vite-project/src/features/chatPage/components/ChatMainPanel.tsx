import { chatPageStyles } from './ChatPage.styles';
import { MessageList } from '../../messageList';
import { MessageComposer } from '../../messageComposer';

/** Right pane — message thread and composer. */
export function ChatMainPanel(): React.JSX.Element {
  return (
    <div style={chatPageStyles.main}>
      <MessageList />
      <MessageComposer />
    </div>
  );
}
