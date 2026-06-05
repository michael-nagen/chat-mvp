import { conversationService } from './conversations.service';
import { Conversation } from './conversations.types';

/**
 * Mid-layer between the controller and the service, and the entry point other
 * domains use to reach conversations. Nothing here needs another domain today,
 * so these are pass-throughs; the seam is here for when cross-domain
 * coordination is later required.
 */
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
