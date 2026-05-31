import { useCallback, useEffect, useState } from "react";
import type { Message } from "../shared/contract/contract";
import { useChatContext } from "../chatPage/ChatContext";
import { sendMessage } from "../shared/chatApi/apiClient";
import { canSend } from "./MessageComposer.logic";

export type MessageComposerHandlers = {
  value: string;
  onChange: (value: string) => void;
  isSending: boolean;
  sendable: boolean;
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  handleKeyDown: (event: React.KeyboardEvent<HTMLTextAreaElement>) => void;
};

/**
 * Manages draft text, optimistic send, rollback on failure,
 * and exposes form handlers — all wired to ChatContext.
 */
export function useMessageComposer(): MessageComposerHandlers {
  const { selectedConversationId, setMessages, setSendError } = useChatContext();
  const [value, setValue] = useState("");
  const [isSending, setIsSending] = useState(false);

  // clear draft when the user switches conversations
  useEffect(() => {
    setValue("");
  }, [selectedConversationId]);

  const onSend = useCallback(async (): Promise<void> => {
    if (!selectedConversationId || isSending) return;
    const trimmed = value.trim();
    if (!trimmed) return;

    const tempId = `temp-${Date.now()}`;
    const optimisticMessage: Message = {
      id: tempId,
      conversationId: selectedConversationId,
      sender: "user",
      content: trimmed,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, optimisticMessage]);
    setValue("");
    setIsSending(true);

    try {
      const res = await sendMessage(selectedConversationId, trimmed);
      setMessages((prev) => prev.map((m) => (m.id === tempId ? res.message : m)));
    } catch (err) {
      setMessages((prev) => prev.filter((m) => m.id !== tempId));
      setValue(trimmed);
      setSendError(err instanceof Error ? err.message : "Failed to send message");
    } finally {
      setIsSending(false);
    }
  }, [selectedConversationId, isSending, value, setMessages, setSendError]);

  const sendable = canSend(value, isSending);

  const handleSubmit = useCallback((event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    if (sendable) void onSend();
  }, [sendable, onSend]);

  const handleKeyDown = useCallback((event: React.KeyboardEvent<HTMLTextAreaElement>): void => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      if (sendable) void onSend();
    }
  }, [sendable, onSend]);

  return { value, onChange: setValue, isSending, sendable, handleSubmit, handleKeyDown };
}
