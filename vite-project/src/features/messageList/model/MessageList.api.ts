import type { Message } from '../../shared/entities/Message.types';
import { requestMessages } from '../../shared/api/apiClient';

export type GetMessagesResponse = {
  messages: Message[];
  nextCursor: string | null;
};

export async function getConversationMessages(
  conversationId: string,
  cursor?: string,
  limit?: number,
): Promise<GetMessagesResponse> {
  return requestMessages(conversationId, cursor, limit);
}
