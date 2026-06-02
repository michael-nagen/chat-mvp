import { messageListStyles } from './MessageList.styles';

/** Prompt shown when no conversation is selected. */
export function MessageListNoSelection(): React.JSX.Element {
  return <div style={messageListStyles.center}>Select a conversation to start</div>;
}
