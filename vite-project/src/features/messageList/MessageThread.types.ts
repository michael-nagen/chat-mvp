import type { Dispatch, SetStateAction } from 'react';
import type { Message } from '../../shared/entities/Message.types';

export type MessageThreadContextValue = {
  messages: Message[];
  setMessages: Dispatch<SetStateAction<Message[]>>;
};
