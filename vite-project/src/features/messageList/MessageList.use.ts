import { useEffect, useReducer } from "react";
import type { MessageListViewProps } from "./MessageList.types";
import { useChatSelection } from "../chatPage/ChatSelection.context";
import { getConversationMessages } from "./MessageList.api";
import { useMessageThread } from "./MessageThread.context";

type MessageListState = {
  isLoading: boolean;
  error: string | null;
};

type MessageListAction =
  | { type: "LOAD_START" }
  | { type: "LOAD_SUCCESS" }
  | { type: "LOAD_ERROR"; error: string }
  | { type: "NO_SELECTION" };

const initialMessageListState: MessageListState = {
  isLoading: false,
  error: null,
};

function messageListReducer(
  state: MessageListState,
  action: MessageListAction,
): MessageListState {
  switch (action.type) {
    case "LOAD_START":
      return { isLoading: true, error: null };
    case "LOAD_SUCCESS":
      return { isLoading: false, error: null };
    case "LOAD_ERROR":
      return { isLoading: false, error: action.error };
    case "NO_SELECTION":
      return initialMessageListState;
    default:
      return state;
  }
}

/** Fetches messages for the selected conversation and exposes loading/error state. */
export function useMessageList(): MessageListViewProps {
  const { selectedConversationId } = useChatSelection();
  const { messages, setMessages } = useMessageThread();
  const [state, dispatch] = useReducer(messageListReducer, initialMessageListState);

  useEffect(() => {
    if (!selectedConversationId) {
      dispatch({ type: "NO_SELECTION" });
      return;
    }
    let cancelled = false;
    dispatch({ type: "LOAD_START" });
    getConversationMessages(selectedConversationId)
      .then((res) => {
        if (cancelled) return;
        setMessages(res.messages);
        dispatch({ type: "LOAD_SUCCESS" });
      })
      .catch((err) => {
        if (cancelled) return;
        dispatch({
          type: "LOAD_ERROR",
          error: err instanceof Error ? err.message : "Failed to load messages",
        });
      });
    return () => { cancelled = true; };
  }, [selectedConversationId, setMessages]);

  return {
    messages,
    isLoading: state.isLoading,
    error: state.error,
    hasSelectedConversation: selectedConversationId !== null,
  };
}
