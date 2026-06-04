import { getConversationsForUser } from './getConversationsForUser';
import { insert } from './createConversation';
import { findById } from './findById';
import { updateLastMessage } from './updateLastMessage';

export const conversationRepository = {
  getConversationsForUser,
  insert,
  findById,
  updateLastMessage,
};
