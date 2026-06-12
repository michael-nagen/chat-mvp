import type { RawMessage } from '../../../shared/entities/Message.types';
import { get } from '../../../shared/api/apiClient';

export type GetMessagesResponse = {
  messages: RawMessage[];
  nextCursor: string | null;
};

export async function getConversationMessages({
  conversationId,
  cursor,
  limit,
}: {
  conversationId: string;
  cursor?: string;
  limit?: number;
}): Promise<GetMessagesResponse> {
  return get<GetMessagesResponse>(`/conversations/${conversationId}/messages`, {
    query: { cursor, limit },
  });
}
