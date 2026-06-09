import { conversationService } from './conversations.service';
import { Conversation } from './conversations.types';

export const conversationOrchestrator = {
  getForUser(userId: string): Conversation[] {
    return conversationService.getForUser(userId);
  },

  createConversation(input: { title: string; userId: string }): Conversation {
    return conversationService.createConversation(input);
  },

  getById(id: string): Conversation | undefined {
    return conversationService.getById(id);
  },

  updateLastMessage(id: string, lastMessage: string, updatedAt: string): Conversation | undefined {
    return conversationService.updateLastMessage(id, lastMessage, updatedAt);
  },
};
