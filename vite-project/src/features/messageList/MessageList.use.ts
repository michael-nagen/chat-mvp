import { useEffect, useReducer } from 'react';
import type { MessageListViewProps } from './MessageList.types';
import { useChatSelection } from '../chatPage/ChatSelection.context';
import { getConversationMessages } from './model/MessageList.api';
import { useMessageThread } from '../messageThread';
import { messageListReducer, initialMessageListState } from './model/MessageList.reducer';

/** Fetches messages for the selected conversation and exposes loading/error state. */
export function useMessageList(): MessageListViewProps {
  const { selectedConversationId } = useChatSelection();
  const { messages, replaceMessages } = useMessageThread();
  const [state, dispatch] = useReducer(messageListReducer, initialMessageListState);

  useEffect(() => {
    if (!selectedConversationId) {
      dispatch({ type: 'NO_SELECTION' });
      return;
    }
    let cancelled = false;
    dispatch({ type: 'LOAD_START' });
    getConversationMessages(selectedConversationId)
      .then((res) => {
        if (cancelled) return;
        replaceMessages(res.messages);
        dispatch({ type: 'LOAD_SUCCESS' });
      })
      .catch((err) => {
        if (cancelled) return;
        dispatch({
          type: 'LOAD_ERROR',
          error: err instanceof Error ? err.message : 'Failed to load messages',
        });
      });
    return () => { cancelled = true; };
  }, [selectedConversationId, replaceMessages]);

  return {
    messages,
    isLoading: state.isLoading,
    error: state.error,
    hasSelectedConversation: selectedConversationId !== null,
  };
}
