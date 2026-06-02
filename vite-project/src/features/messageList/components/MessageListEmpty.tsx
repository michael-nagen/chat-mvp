import { messageListStyles } from './MessageList.styles';

/** Empty-state message shown when the selected thread has no messages. */
export function MessageListEmpty(): React.JSX.Element {
  return <div style={messageListStyles.center}>No messages yet</div>;
}
