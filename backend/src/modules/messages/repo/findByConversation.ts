import { Message } from '../messages.types';
import { messages } from './data';

export const findByConversation = (conversationId: string): Message[] =>
  messages.filter((message) => message.conversationId === conversationId);
