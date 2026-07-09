import type { RawMessage } from '../../../shared/entities/Message.types';
import { post } from '../../../shared/api/apiClient';

// Mirror of the backend send-message routing instruction: dm/group need no AI
// reply; assistant/tutor tell the client to start the AI stream.
export type AiReplyDecision =
  | { required: false }
  | { required: true; conversationType: 'assistant' | 'tutor' };

export type SendMessageResponse = {
  message: RawMessage;
  aiReply: AiReplyDecision;
};

export async function sendUserMessage({
  conversationId,
  content,
}: {
  conversationId: string;
  content: string;
}): Promise<SendMessageResponse> {
  return post<SendMessageResponse>(`/conversations/${conversationId}/messages`, { content });
}
