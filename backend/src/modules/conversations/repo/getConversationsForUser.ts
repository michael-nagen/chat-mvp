import { Conversation } from '../conversations.types';
import { conversations } from './data';

export const getConversationsForUser = (userId: string): Conversation[] =>
  conversations.filter((conversation) => conversation.participantIds.includes(userId));
