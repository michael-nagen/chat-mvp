import { useEffect, useReducer } from 'react';
import type { ConversationListViewProps } from './ConversationList.types';
import { useAuth } from '../auth';
import { useChatSelection } from '../chatPage/ChatSelection.context';
import { useChatParticipants } from '../chatPage/ChatParticipants.context';
import { getConversations } from './ConversationList.api';
import { conversationListReducer, initialConversationListState } from './ConversationList.reducer';

/** Fetches the current user's conversations and wires chat selection state. */
export function useConversationList(): ConversationListViewProps {
  const { user } = useAuth();
  const userId = user?.id;
  const { refreshToken } = useChatSelection();
  const { setParticipants } = useChatParticipants();
  const [state, dispatch] = useReducer(conversationListReducer, initialConversationListState);

  useEffect(() => {
    if (!userId) return;
    let cancelled = false;
    dispatch({ type: 'LOAD_START' });
    getConversations()
      .then((res) => {
        if (cancelled) return;
        dispatch({ type: 'LOAD_SUCCESS', conversations: res.conversations });
        // Feed the sender map so message bubbles can render avatars by senderId.
        setParticipants(res.conversations.flatMap((c) => c.participants));
      })
      .catch((err) => {
        if (cancelled) return;
        dispatch({
          type: 'LOAD_ERROR',
          error: err instanceof Error ? err.message : 'Failed to load conversations',
        });
      });
    return () => { cancelled = true; };
  }, [userId, refreshToken, setParticipants]);

  return {
    conversations: state.conversations,
    isLoading: state.isLoading,
    error: state.error,
  };
}
