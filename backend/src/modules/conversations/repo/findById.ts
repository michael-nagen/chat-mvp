import { Conversation } from '../conversations.types';
import { conversations } from './data';

export const findById = (id: string): Conversation | undefined =>
  conversations.find((conversation) => conversation.id === id);
