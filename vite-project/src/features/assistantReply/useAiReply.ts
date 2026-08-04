import { useMessageThread } from '../messageThread';
import { useToast } from '../toast';
import { streamAiReply } from './AiReply.api';

// Drives a streamed AI reply (assistant or tutor): show an optimistic bubble,
// surface progress, grow it with tokens, then stamp its persisted id and any
// citations. Rolls back and toasts on failure. The caller passes the AI
// participant id so this works for either conversation type.
export function useAiReply(): {
  streamReply: (params: {
    conversationId: string;
    aiSenderId: string;
  }) => Promise<void>;
} {
  const {
    addOptimisticMessage,
    setAssistantStatus,
    appendAssistantDelta,
    finishAssistant,
    rollbackMessage,
  } = useMessageThread();
  const { showToast } = useToast();

  async function streamReply({
    conversationId,
    aiSenderId,
  }: {
    conversationId: string;
    aiSenderId: string;
  }): Promise<void> {
    const tempId = `temp-ai-${crypto.randomUUID()}`;
    addOptimisticMessage({
      id: tempId,
      conversationId,
      sender: 'assistant',
      senderId: aiSenderId,
      content: '',
      timestamp: new Date().toISOString(),
    });

    let finished = false;
    try {
      await streamAiReply({
        conversationId,
        handlers: {
          onProgress: (label) => setAssistantStatus(tempId, label),
          onToken: (delta) => appendAssistantDelta(tempId, delta),
          onDone: (messageId, citations) => {
            finished = true;
            finishAssistant(tempId, messageId, citations);
          },
        },
      });
      if (!finished) {
        rollbackMessage(tempId);
      }
    } catch (err) {
      rollbackMessage(tempId);
      showToast(
        err instanceof Error ? err.message : 'The assistant failed to respond',
      );
    }
  }
  return { streamReply };
}
