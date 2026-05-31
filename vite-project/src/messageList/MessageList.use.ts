import { useEffect, useRef, useState } from "react";
import type { Message } from "../shared/contract/contract";
import type { MessageListViewProps } from "./MessageList.types";
import { useChatContext } from "../chatPage/ChatContext";
import { getMessages } from "../shared/chatApi/apiClient";

/** Scrolls the bottom anchor into view whenever the messages list changes. */
export function useAutoScroll(messages: Message[]) {
  const bottomRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end" });
  }, [messages]);
  return bottomRef;
}

/** Fetches messages for the selected conversation and exposes loading/error state. */
export function useMessageList(): MessageListViewProps {
  const { selectedConversationId, messages, setMessages } = useChatContext();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedConversationId) {
      setIsLoading(false);
      setError(null);
      return;
    }
    let cancelled = false;
    setIsLoading(true);
    setError(null);
    getMessages(selectedConversationId)
      .then((res) => {
        if (cancelled) return;
        setMessages(res.messages);
        setIsLoading(false);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Failed to load messages");
        setIsLoading(false);
      });
    return () => { cancelled = true; };
  }, [selectedConversationId, setMessages]);

  return {
    messages,
    isLoading,
    error,
    hasSelectedConversation: selectedConversationId !== null,
  };
}
