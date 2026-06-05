import { Conversation } from './conversations.types';
import { conversations } from '../../shared/store/inMemoryStore';

const getConversationsForUser = (userId: string): Conversation[] =>
  conversations.filter((conversation) => conversation.participantIds.includes(userId));

const insert = (conversation: Conversation): Conversation => {
  conversations.push(conversation);
  return conversation;
};

const findById = (id: string): Conversation | undefined =>
  conversations.find((conversation) => conversation.id === id);

const updateLastMessage = (
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

export const conversationRepository = {
  getConversationsForUser,
  insert,
  findById,
  updateLastMessage,
};
