import type { ConversationListErrorProps } from '../ConversationList.types';
import { conversationListStyles } from './ConversationList.styles';

/** Inline error message shown when conversations fail to load. */
export function ConversationListError({ error }: ConversationListErrorProps): React.JSX.Element {
  return <div style={conversationListStyles.error}>{error}</div>;
}
