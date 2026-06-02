import type { Conversation } from '../../entities/Conversation.types';
import type { Message } from '../../entities/Message.types';
import type { User } from '../../entities/User.types';
import { conversations, messages, users } from './mokeapi';

export function serverLogin(name: string): { token: string; user: User } {
  const user = users.find((u) => u.name.toLowerCase() === name.trim().toLowerCase());
  if (!user) throw Object.assign(new Error('User not found'), { status: 401 });
  return { token: `mock-token-${user.id}`, user };
}

export function serverGetConversations(userId: string): { conversations: Conversation[] } {
  const result = conversations
    .filter((c) => c.participantIds.includes(userId))
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  return { conversations: result };
}

export function serverGetMessages(
  conversationId: string,
  cursor?: string,
  limit: number = 20,
): { messages: Message[]; nextCursor: string | null } {
  const all = messages.filter((m) => m.conversationId === conversationId);
  const endIndex = cursor
    ? Math.max(0, all.findIndex((m) => m.id === cursor))
    : all.length;
  const startIndex = Math.max(0, endIndex - limit);
  const page = all.slice(startIndex, endIndex);
  return { messages: page, nextCursor: startIndex > 0 ? page[0].id : null };
}

export function serverSendMessage(
  conversationId: string,
  content: string,
): { message: Message } {
  const now = new Date().toISOString();
  const message: Message = {
    id: `m-${Date.now()}`,
    conversationId,
    sender: 'user',
    content,
    timestamp: now,
  };
  messages.push(message);
  const conversation = conversations.find((c) => c.id === conversationId);
  if (conversation) {
    conversation.lastMessage = content;
    conversation.updatedAt = now;
  }
  return { message };
}
