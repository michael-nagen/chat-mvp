import type { Conversation } from '../entities/Conversation.types';
import type { Message } from '../entities/Message.types';
import type { User } from '../entities/User.types';
import {
  serverGetConversations,
  serverGetMessages,
  serverLogin,
  serverSendMessage,
} from './mockServer';

const READ_DELAY_MS = 500;
const WRITE_DELAY_MS = 400;

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function requestLogin(name: string): Promise<{ token: string; user: User }> {
  await wait(WRITE_DELAY_MS);
  return serverLogin(name);
}

export async function requestConversations(userId: string): Promise<{ conversations: Conversation[] }> {
  await wait(READ_DELAY_MS);
  return serverGetConversations(userId);
}

export async function requestMessages(
  conversationId: string,
  cursor?: string,
  limit?: number,
): Promise<{ messages: Message[]; nextCursor: string | null }> {
  await wait(READ_DELAY_MS);
  return serverGetMessages(conversationId, cursor, limit);
}

export async function requestSendMessage(
  conversationId: string,
  content: string,
): Promise<{ message: Message }> {
  await wait(WRITE_DELAY_MS);
  return serverSendMessage(conversationId, content);
}
