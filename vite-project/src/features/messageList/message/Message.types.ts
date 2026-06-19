import type { Message } from '../../../shared/entities/Message.types';

export type MessageProps = {
  message: Message;
};

export type MessageContextValue = {
  message: Message;
};
