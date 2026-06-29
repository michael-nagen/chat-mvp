import type { Conversation } from '../../../shared/entities/Conversation.types';
import type { UserSummary } from '../../../shared/entities/User.types';
import { get, post } from '../../../shared/api/apiClient';

export async function getContacts(): Promise<UserSummary[]> {
  return get<UserSummary[]>('/me/contacts');
}

export async function createDm(participantIds: string[]): Promise<Conversation> {
  return post<Conversation>('/conversations/dm', { participantIds });
}

export async function createGroup({
  participantIds,
  title,
}: {
  participantIds: string[];
  title: string;
}): Promise<Conversation> {
  return post<Conversation>('/conversations/groups', { participantIds, title });
}
