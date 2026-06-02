import type { Conversation } from '../entities/Conversation.types';
import { requestConversations } from '../shared/chatApi/apiClient';

export type GetConversationsResponse = {
  conversations: Conversation[];
};

export async function getUserConversations(userId: string): Promise<GetConversationsResponse> {
  return requestConversations(userId);
}
