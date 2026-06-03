import { useState } from 'react';
import type { MessageComposerViewProps } from './MessageComposer.types';
import { useChatSelection } from '../chatPage/ChatSelection.context';
import { useMessageThread } from '../messageThread';
import { sendUserMessage } from './model/MessageComposer.api';
import { useToast } from '../toast';
import {
  canSend,
  createOptimisticMessage,
  createSubmitHandler,
  createKeyDownHandler,
} from './model/MessageComposer.utils';

/**
 * Manages draft text, optimistic send, rollback on failure,
 * and exposes form handlers for the selected conversation.
 */
export function useMessageComposer(): MessageComposerViewProps {
  const { selectedConversationId } = useChatSelection();
  const { addOptimisticMessage, confirmMessage, rollbackMessage } = useMessageThread();
  const { showToast } = useToast();
  const [draft, setDraft] = useState({ conversationId: selectedConversationId, value: '' });
  const [isSending, setIsSending] = useState(false);

  const value = draft.conversationId === selectedConversationId ? draft.value : '';

  function setValue(nextValue: string): void {
    setDraft({ conversationId: selectedConversationId, value: nextValue });
  }

  async function onSend(): Promise<void> {
    if (!selectedConversationId || isSending) return;
    const trimmed = value.trim();
    if (!trimmed) return;

    const optimisticMessage = createOptimisticMessage(selectedConversationId, trimmed);
    const tempId = optimisticMessage.id;

    addOptimisticMessage(optimisticMessage);
    setValue('');
    setIsSending(true);

    try {
      const res = await sendUserMessage(selectedConversationId, trimmed);
      confirmMessage(tempId, res.message);
    } catch (err) {
      rollbackMessage(tempId);
      setDraft({ conversationId: selectedConversationId, value: trimmed });
      showToast(err instanceof Error ? err.message : 'Failed to send message');
    } finally {
      setIsSending(false);
    }
  }

  const sendable = canSend(value, isSending);
  const handleSubmit = createSubmitHandler(sendable, () => void onSend());
  const handleKeyDown = createKeyDownHandler(sendable, () => void onSend());

  return { value, onChange: setValue, isSending, sendable, handleSubmit, handleKeyDown };
}
