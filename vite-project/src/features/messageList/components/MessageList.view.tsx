import type { MessageListViewProps } from '../MessageList.types';
import { MessageSkeletonList } from '../message';
import { MessageThreadList } from './MessageThreadList';
import { MessageListNoSelection } from './MessageListNoSelection';
import { MessageListError } from './MessageListError';
import { MessageListEmpty } from './MessageListEmpty';

/**
 * Selects which message-thread state to render.
 *
 * Priority:
 *  1. No conversation selected → prompt to pick one
 *  2. Loading                  → skeleton bubbles
 *  3. Error                    → inline error text
 *  4. Empty thread             → empty-state message
 *  5. Messages                 → scrollable, auto-scrolled list
 */
export function MessageListView({
  messages,
  isLoading,
  error,
  hasSelectedConversation,
}: MessageListViewProps): React.JSX.Element {
  if (!hasSelectedConversation) return <MessageListNoSelection />;
  if (isLoading) return <MessageSkeletonList />;
  if (error) return <MessageListError error={error} />;
  if (messages.length === 0) return <MessageListEmpty />;

  return <MessageThreadList messages={messages} />;
}
