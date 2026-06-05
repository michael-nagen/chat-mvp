import { conversationOrchestrator } from '../conversations/conversations.orchestrator';
import { ConversationNotFoundError } from '../../shared/errors/AppError';
import { messageService } from './messages.service';
import { GetMessagesOptions, Message, MessagePage } from './messages.types';

// A user may only touch a conversation they're a participant of. A non-member
// is treated the same as a missing conversation (404) so ids can't be probed.
// This crosses into the conversations domain, so it lives in the orchestrator
// rather than the message service, and reaches that domain through its
// orchestrator rather than its service directly.
const ensureAccess = (conversationId: string, userId: string): void => {
  const conversation = conversationOrchestrator.getById(conversationId);
  if (!conversation || !conversation.participantIds.includes(userId)) {
    throw new ConversationNotFoundError();
  }
};

/**
 * Mid-layer between the controller and the services. Owns the cross-domain
 * coordination for messages: access is verified against the conversations
 * domain, and a new message updates the conversation's preview. The message
 * service itself stays pure to its own domain.
 */
export const messageOrchestrator = {
  listMessages(conversationId: string, userId: string, options: GetMessagesOptions): MessagePage {
    ensureAccess(conversationId, userId);
    return messageService.getMessages(conversationId, options);
  },

  createMessage(conversationId: string, userId: string, content: string): Message {
    ensureAccess(conversationId, userId);
    const message = messageService.createMessage(conversationId, userId, content);
    conversationOrchestrator.updateLastMessage(conversationId, content, message.createdAt);
    return message;
  },
};
