import type { Dispatch, SetStateAction } from 'react';
import type { Message } from '../entities/Message.types';

export type MessageThreadContextValue = {
  messages: Message[];
  setMessages: Dispatch<SetStateAction<Message[]>>;
};
