import { conversationRepository } from './repo';
import { Conversation } from './conversations.types';

const updatedTime = (conversation: Conversation): number =>
  new Date(conversation.updatedAt).getTime();

export const conversationService = {
  getForUser(userId: string): Conversation[] {
    return conversationRepository
      .getConversationsForUser(userId)
      .sort((a, b) => updatedTime(b) - updatedTime(a));
  },

  createConversation(input: { title: string; userId: string }): Conversation {
    const now = new Date();
    const conversation: Conversation = {
      id: `c-${now.getTime()}`,
      title: input.title,
      participantIds: [input.userId],
      lastMessage: '',
      updatedAt: now.toISOString(),
    };
    return conversationRepository.insert(conversation);
  },

  getById(id: string): Conversation | undefined {
    return conversationRepository.findById(id);
  },

  updateLastMessage(id: string, lastMessage: string, updatedAt: string): Conversation | undefined {
    return conversationRepository.updateLastMessage(id, lastMessage, updatedAt);
  },
};
