import { conversationService } from '../conversations/conversations.service';
import { ConversationNotFoundError } from '../../shared/errors/AppError';
import { messageRepository } from './repo';
import { Message } from './messages.types';

const createdTime = (message: Message): number => new Date(message.createdAt).getTime();

// A user may only touch a conversation they're a participant of. A non-member
// is treated the same as a missing conversation (404) so ids can't be probed.
const ensureAccess = (conversationId: string, userId: string): void => {
  const conversation = conversationService.getById(conversationId);
  if (!conversation || !conversation.participantIds.includes(userId)) {
    throw new ConversationNotFoundError();
  }
};

export const messageService = {
  getMessages(conversationId: string, userId: string): Message[] {
    ensureAccess(conversationId, userId);
    // Oldest -> newest, as the chat thread renders top to bottom.
    return messageRepository
      .findByConversation(conversationId)
      .sort((a, b) => createdTime(a) - createdTime(b));
  },

  createMessage(conversationId: string, senderId: string, content: string): Message {
    ensureAccess(conversationId, senderId);
    const now = new Date();
    const message: Message = {
      id: `m-${now.getTime()}`,
      conversationId,
      senderId,
      content,
      createdAt: now.toISOString(),
    };
    messageRepository.insert(message);
    conversationService.updateLastMessage(conversationId, content, message.createdAt);
    return message;
  },
};
