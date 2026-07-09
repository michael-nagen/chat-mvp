import { useState } from 'react';
import type { MessageComposerViewProps } from './MessageComposer.types';
import { useChatSelection } from '../chatPage/ChatSelection.context';
import { useMessageThread } from '../messageThread';
import { useAiReply } from '../assistantReply';
import { useAuth } from '../auth';
import { useToast } from '../toast';
import {
  canSend,
  createSubmitHandler,
  createKeyDownHandler,
  sendOptimisticMessage,
} from './model/MessageComposer.utils';


export function useMessageComposer(): MessageComposerViewProps {
  const { selectedConversationId, selectedConversation } = useChatSelection();
  const { addOptimisticMessage, confirmMessage, rollbackMessage } = useMessageThread();
  const { streamReply } = useAiReply();
  const { user } = useAuth();
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

    setValue('');
    setIsSending(true);
    try {
      const result = await sendOptimisticMessage({
        conversationId: selectedConversationId,
        content: trimmed,
        userId: user?.id ?? null,
        thread: { addOptimisticMessage, confirmMessage, rollbackMessage },
      });
      if (!result.ok) {
        setDraft({ conversationId: selectedConversationId, value: trimmed });
        showToast(result.error);
        return;
      }
      // Assistant and tutor replies both stream; dm/group have no AI reply.
      const streamsAiReply =
        selectedConversation?.type === 'assistant' ||
        selectedConversation?.type === 'tutor';
      if (streamsAiReply) {
        const aiSenderId = selectedConversation.participants.find(
          (p) => p.id !== user?.id,
        )?.id;
        if (!aiSenderId) {
          showToast('Could not find the assistant in this conversation.');
          return;
        }
        await streamReply({
          conversationId: selectedConversationId,
          aiSenderId,
        });
      }
    } finally {
      setIsSending(false);
    }
  }

  const sendable = canSend({ value, isSending });
  const handleSubmit = createSubmitHandler({ sendable, onSend: () => void onSend() });
  const handleKeyDown = createKeyDownHandler({ sendable, onSend: () => void onSend() });

  return {
    value,
    onChange: setValue,
    isSending,
    sendable,
    handleSubmit,
    handleKeyDown,
  };
}
