import { useEffect, useState } from 'react';
import type { Conversation } from '../shared/contract/contract';
import type { ConversationListViewProps } from './ConversationList.types';
import { buildConversationListViewProps } from './ConversationList.logic';
import { useAuth } from '../auth';
import { useChatContext } from '../chatPage/ChatContext';
import { getConversations } from '../shared/chatApi/apiClient';

/** Fetches the current user's conversations and wires selection state from ChatContext. */
export function useConversationList(): ConversationListViewProps {
  const { user } = useAuth();
  const { selectedConversationId, selectConversation } = useChatContext();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    setIsLoading(true);
    setError(null);
    getConversations(user.id)
      .then((res) => {
        if (cancelled) return;
        setConversations(res.conversations);
        setIsLoading(false);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : 'Failed to load conversations');
        setIsLoading(false);
      });
    return () => { cancelled = true; };
  }, [user?.id]);

  return buildConversationListViewProps({
    conversations,
    selectedConversationId,
    isLoading,
    error,
    onSelectConversation: selectConversation,
  });
}
