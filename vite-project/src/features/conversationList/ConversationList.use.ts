import { useEffect, useReducer } from 'react';
import type { ConversationListViewProps } from './ConversationList.types';
import { useAuth } from '../auth';
import { useChatSelection } from '../chatPage/ChatSelection.context';
import { getConversations } from './ConversationList.api';
import { conversationListReducer, initialConversationListState } from './ConversationList.reducer';

/** Fetches the current user's conversations and wires chat selection state. */
export function useConversationList(): ConversationListViewProps {
  const { user } = useAuth();
  const userId = user?.id;
  const { refreshToken } = useChatSelection();
  const [state, dispatch] = useReducer(conversationListReducer, initialConversationListState);

  useEffect(() => {
    if (!userId) return;
    let cancelled = false;
    dispatch({ type: 'LOAD_START' });
    getConversations()
      .then((res) => {
        if (cancelled) return;
        dispatch({ type: 'LOAD_SUCCESS', conversations: res.conversations });
      })
      .catch((err) => {
        if (cancelled) return;
        dispatch({
          type: 'LOAD_ERROR',
          error: err instanceof Error ? err.message : 'Failed to load conversations',
        });
      });
    return () => { cancelled = true; };
  }, [userId, refreshToken]);

  return {
    conversations: state.conversations,
    isLoading: state.isLoading,
    error: state.error,
  };
}
