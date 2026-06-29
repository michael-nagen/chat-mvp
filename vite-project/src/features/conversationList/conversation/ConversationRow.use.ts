import { useChatSelection } from '../../chatPage/ChatSelection.context';
import { useConversationRowContext } from './ConversationRow.context';
import type { ConversationRowViewProps } from './ConversationRow.types';

export function useConversationRow(): ConversationRowViewProps {
  const { conversation } = useConversationRowContext();
  const { selectedConversationId, selectConversation } = useChatSelection();

  function onSelect(): void {
    selectConversation(conversation.id, conversation);
  }

  return {
    conversation,
    isSelected: conversation.id === selectedConversationId,
    onSelect,
  };
}
