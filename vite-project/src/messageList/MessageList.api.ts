import type { Message } from '../entities/Message.types';
import { requestMessages } from '../shared/chatApi/apiClient';

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
