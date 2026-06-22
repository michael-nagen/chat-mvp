import type { Conversation } from '../../shared/entities/Conversation.types';
import { get } from '../../shared/api/apiClient';

export type GetConversationsResponse = {
  conversations: Conversation[];
};

export async function getConversations(): Promise<GetConversationsResponse> {
  return get<GetConversationsResponse>('/conversations');
}
