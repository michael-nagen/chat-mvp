import { useEffect, useReducer } from 'react';
import type { Conversation } from '../entities/Conversation.types';
import type { ConversationListViewProps } from './ConversationList.types';
import { useAuth } from '../auth';
import { getUserConversations } from './ConversationList.api';

type ConversationListState = {
  conversations: Conversation[];
  isLoading: boolean;
  error: string | null;
};

type ConversationListAction =
  | { type: 'LOAD_START' }
  | { type: 'LOAD_SUCCESS'; conversations: Conversation[] }
  | { type: 'LOAD_ERROR'; error: string };

const initialState: ConversationListState = {
  conversations: [],
  isLoading: true,
  error: null,
};

function conversationListReducer(
  state: ConversationListState,
  action: ConversationListAction,
): ConversationListState {
  switch (action.type) {
    case 'LOAD_START':
      return { conversations: state.conversations, isLoading: true, error: null };
    case 'LOAD_SUCCESS':
      return { conversations: action.conversations, isLoading: false, error: null };
    case 'LOAD_ERROR':
      return { conversations: [], isLoading: false, error: action.error };
    default:
      return state;
  }
}

/** Fetches the current user's conversations and wires chat selection state. */
export function useConversationList(): ConversationListViewProps {
  const { user } = useAuth();
  const userId = user?.id;
  const [state, dispatch] = useReducer(conversationListReducer, initialState);

  useEffect(() => {
    if (!userId) return;
    let cancelled = false;
    dispatch({ type: 'LOAD_START' });
    getUserConversations(userId)
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
  }, [userId]);

  return {
    conversations: state.conversations,
    isLoading: state.isLoading,
    error: state.error,
  };
}
