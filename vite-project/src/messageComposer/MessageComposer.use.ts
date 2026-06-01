import { useState } from "react";
import type { Message } from "../entities/Message.types";
import { useChatSelection } from "../chatPage/ChatSelection.context";
import { useMessageThread } from "../messageList/MessageThread.context";
import { sendMessage } from "../shared/chatApi/apiClient";
import { useToast } from "../toast";
import { canSend } from "./MessageComposer.utils";

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
 * and exposes form handlers for the selected conversation.
 */
export function useMessageComposer(): MessageComposerHandlers {
  const { selectedConversationId } = useChatSelection();
  const { setMessages } = useMessageThread();
  const { showToast } = useToast();
  const [draft, setDraft] = useState({ conversationId: selectedConversationId, value: "" });
  const [isSending, setIsSending] = useState(false);

  const value = draft.conversationId === selectedConversationId ? draft.value : "";

  function setValue(nextValue: string): void {
    setDraft({ conversationId: selectedConversationId, value: nextValue });
  }

  async function onSend(): Promise<void> {
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
      setDraft({ conversationId: selectedConversationId, value: trimmed });
      showToast(err instanceof Error ? err.message : "Failed to send message");
    } finally {
      setIsSending(false);
    }
  }

  const sendable = canSend(value, isSending);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    if (sendable) void onSend();
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>): void {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      if (sendable) void onSend();
    }
  }

  return { value, onChange: setValue, isSending, sendable, handleSubmit, handleKeyDown };
}
