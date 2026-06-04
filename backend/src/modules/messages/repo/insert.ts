import { Message } from '../messages.types';
import { messages } from './data';

export const insert = (message: Message): Message => {
  messages.push(message);
  return message;
};
