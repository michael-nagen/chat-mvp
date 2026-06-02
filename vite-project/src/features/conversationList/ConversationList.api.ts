import type { Conversation } from '../../shared/entities/Conversation.types';
import { requestConversations } from '../../shared/api/apiClient';

export type GetConversationsResponse = {
  conversations: Conversation[];
};

export async function getUserConversations(userId: string): Promise<GetConversationsResponse> {
  return requestConversations(userId);
}
