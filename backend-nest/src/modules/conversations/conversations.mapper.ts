import { Conversation } from '../memory/entities';
import { ConversationResponse } from './conversations.types';

// participantIds is internal and never exposed on the wire.
export const toConversationResponse = (
  conversation: Conversation,
): ConversationResponse => ({
  id: conversation.id,
  title: conversation.title,
  lastMessage: conversation.lastMessage,
  updatedAt: conversation.updatedAt,
});
