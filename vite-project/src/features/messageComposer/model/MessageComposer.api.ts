import type { RawMessage } from '../../../shared/entities/Message.types';
import { post } from '../../../shared/api/apiClient';

export type SendMessageResponse = {
  message: RawMessage;
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
