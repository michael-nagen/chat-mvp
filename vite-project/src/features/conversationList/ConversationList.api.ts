import type { Conversation } from '../../shared/entities/Conversation.types';
import { get, post } from '../../shared/api/apiClient';

export type GetConversationsResponse = {
  conversations: Conversation[];
};

export async function getConversations(): Promise<GetConversationsResponse> {
  return get<GetConversationsResponse>('/conversations');
}

export async function createConversation(email: string): Promise<Conversation> {
  return post<Conversation>('/conversations', { email });
}
