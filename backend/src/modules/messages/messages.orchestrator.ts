import { conversationOrchestrator } from '../conversations/conversations.orchestrator';
import { ConversationNotFoundError } from '../../shared/errors/AppError';
import { messageService } from './messages.service';
import { toMessagePageResponse, toMessageResponse } from './messages.mapper';
import { GetMessagesOptions, MessagePageResponse, MessageResponse } from './messages.types';

// Non-members get a 404 (not 403) so conversation ids can't be probed.
const ensureAccess = (conversationId: string, userId: string): void => {
  const conversation = conversationOrchestrator.getById(conversationId);
  if (!conversation || !conversation.participantIds.includes(userId)) {
    throw new ConversationNotFoundError();
  }
};

export const messageOrchestrator = {
  listMessages(
    conversationId: string,
    userId: string,
    options: GetMessagesOptions,
  ): MessagePageResponse {
    ensureAccess(conversationId, userId);
    return toMessagePageResponse(messageService.getMessages(conversationId, options), userId);
  },

  createMessage(conversationId: string, userId: string, content: string): MessageResponse {
    ensureAccess(conversationId, userId);
    // Two writes across domains; no transaction until a real DB lands.
    const message = messageService.createMessage(conversationId, userId, content);
    conversationOrchestrator.updateLastMessage(conversationId, content, message.createdAt);
    return toMessageResponse(message, userId);
  },
};
