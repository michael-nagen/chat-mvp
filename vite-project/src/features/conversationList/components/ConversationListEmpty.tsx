import { conversationListStyles } from './ConversationList.styles';

/** Empty-state message shown when the user has no conversations. */
export function ConversationListEmpty(): React.JSX.Element {
  return <div style={conversationListStyles.center}>No conversations yet</div>;
}
