import { streamEvents } from '../../shared/api/sseClient';

export type AssistantStreamHandlers = {
  onToken: (delta: string) => void;
  onDone: (messageId: string) => void;
};


export async function streamAssistantReply({
  conversationId,
  handlers,
  signal,
}: {
  conversationId: string;
  handlers: AssistantStreamHandlers;
  signal?: AbortSignal;
}): Promise<void> {
  await streamEvents(`/conversations/${conversationId}/assistant/stream`, {
    signal,
    onEvent: ({ event, data }) => {
      if (event === 'token') {
        const { delta } = JSON.parse(data) as { delta: string };
        handlers.onToken(delta);
      } else if (event === 'done') {
        const { messageId } = JSON.parse(data) as { messageId: string };
        handlers.onDone(messageId);
      } else if (event === 'error') {
        const { message } = JSON.parse(data) as { message: string };
        throw new Error(message);
      }
    },
  });
}
