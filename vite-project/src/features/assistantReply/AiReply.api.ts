import { streamEvents } from '../../shared/api/sseClient';
import type { MessageCitation } from '../../shared/entities/Message.types';
import type { AiStreamHandlers } from './AiReply.types';

// Streams an AI reply (assistant or tutor) over the shared SSE endpoint. The
// event contract is token/done/error with an optional progress event; tutor
// `done` carries citations, assistant `done` omits them (treated as empty).
export async function streamAiReply({
  conversationId,
  handlers,
  signal,
}: {
  conversationId: string;
  handlers: AiStreamHandlers;
  signal?: AbortSignal;
}): Promise<void> {
  await streamEvents(`/conversations/${conversationId}/assistant/stream`, {
    signal,
    onEvent: ({ event, data }) => {
      if (event === 'token') {
        const { delta } = JSON.parse(data) as { delta: string };
        handlers.onToken(delta);
      } else if (event === 'progress') {
        const { label } = JSON.parse(data) as { label: string };
        handlers.onProgress?.(label);
      } else if (event === 'done') {
        const { messageId, citations } = JSON.parse(data) as {
          messageId: string;
          citations?: MessageCitation[];
        };
        handlers.onDone(messageId, citations ?? []);
      } else if (event === 'error') {
        const { message } = JSON.parse(data) as { message: string };
        throw new Error(message);
      }
    },
  });
}
