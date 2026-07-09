import type { Conversation } from '../../../shared/entities/Conversation.types';
import type { UserSummary } from '../../../shared/entities/User.types';
import type { CreateConversationRequest } from '../NewConversation.types';
import { get, post } from '../../../shared/api/apiClient';

export async function getContacts(): Promise<UserSummary[]> {
  return get<UserSummary[]>('/me/contacts');
}

export async function createConversation(
  request: CreateConversationRequest,
): Promise<Conversation> {
  return post<Conversation>('/conversations', request);
}
