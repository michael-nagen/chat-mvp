import { useMessageThread } from '../messageThread';
import { useToast } from '../toast';
import { streamAssistantReply } from './AssistantReply.api';


export function useAssistantReply(): {
  streamReply: (params: {
    conversationId: string;
    assistantSenderId: string;
  }) => Promise<void>;
} {
  const {
    addOptimisticMessage,
    appendAssistantDelta,
    finishAssistant,
    rollbackMessage,
  } = useMessageThread();
  const { showToast } = useToast();

  async function streamReply({
    conversationId,
    assistantSenderId,
  }: {
    conversationId: string;
    assistantSenderId: string;
  }): Promise<void> {
    const tempId = `temp-assistant-${crypto.randomUUID()}`;
    addOptimisticMessage({
      id: tempId,
      conversationId,
      sender: 'assistant',
      senderId: assistantSenderId,
      content: '',
      timestamp: new Date().toISOString(),
    });

    let finished = false;
    try {
      await streamAssistantReply({
        conversationId,
        handlers: {
          onToken: (delta) => appendAssistantDelta(tempId, delta),
          onDone: (messageId) => {
            finished = true;
            finishAssistant(tempId, messageId);
          },
        },
      });
      if (!finished) {
        rollbackMessage(tempId);
      }
    } catch (err) {
      rollbackMessage(tempId);
      showToast(
        err instanceof Error ? err.message : 'Assistant failed to respond',
      );
    }
  }
  return { streamReply };
}
