import type { ConversationListViewProps } from '../ConversationList.types';
import { ConversationSkeletonList } from './ConversationSkeletonList';
import { ConversationRows } from './ConversationRows';
import { ConversationListError } from './ConversationListError';
import { ConversationListEmpty } from './ConversationListEmpty';

/**
 * Selects which conversation-list state to render.
 *
 * Priority:
 *  1. Loading       → skeleton rows
 *  2. Error         → inline error text
 *  3. Empty         → empty-state message
 *  4. Conversations → scrollable list of rows
 */
export function ConversationListView({
  conversations,
  isLoading,
  error,
}: ConversationListViewProps): React.JSX.Element {
  if (isLoading) return <ConversationSkeletonList />;
  if (error) return <ConversationListError error={error} />;
  if (conversations.length === 0) return <ConversationListEmpty />;

  return <ConversationRows conversations={conversations} />;
}
