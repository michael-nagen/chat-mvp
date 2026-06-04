import { Conversation } from '../conversations.types';
import { conversations } from './data';

export const updateLastMessage = (
  id: string,
  lastMessage: string,
  updatedAt: string,
): Conversation | undefined => {
  const conversation = conversations.find((c) => c.id === id);
  if (!conversation) {
    return undefined;
  }
  conversation.lastMessage = lastMessage;
  conversation.updatedAt = updatedAt;
  return conversation;
};
