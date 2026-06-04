import { Conversation } from '../conversations.types';
import { conversations } from './data';

export const insert = (conversation: Conversation): Conversation => {
  conversations.push(conversation);
  return conversation;
};
