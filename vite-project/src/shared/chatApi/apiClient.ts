import type { Message } from './../contract/contract';
import type { GetConversationsResponse, GetMessagesResponse, LoginResponse, SendMessageResponse } from './apitypes';
import { conversations, messages, users } from './mokeapi';


/** Authenticates a user by name and returns a token plus the matching user record. */
export async function login(name: string): Promise<LoginResponse> {
    await new Promise(resolve => setTimeout(resolve, 400));
    const user = users.find(u => u.name.toLowerCase() === name.trim().toLowerCase());
    if (!user) {
        throw new Error('User not found');
    }
    return { token: 'mock-token-' + user.id, user };
}

/** Fetches all conversations the given user participates in, sorted newest first. */
export async function getConversations(userId: string): Promise<GetConversationsResponse> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const userConversations = conversations
        .filter(c => c.participantIds.includes(userId))
        .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
    return { conversations: userConversations };
}
/** Loads a page of messages for a conversation, paginating backwards from the given cursor. */
export async function getMessages(
    conversationId: string,
    cursor?: string,
    limit: number = 20,
): Promise<GetMessagesResponse> {
    await new Promise(resolve => setTimeout(resolve, 500));

    // full thread, oldest -> newest
    const all = messages.filter(m => m.conversationId === conversationId);

    // `cursor` is the oldest id already loaded; page backwards (older) from there.
    const endIndex = cursor
        ? Math.max(0, all.findIndex(m => m.id === cursor))
        : all.length;
    const startIndex = Math.max(0, endIndex - limit);

    const page = all.slice(startIndex, endIndex);
    const nextCursor = startIndex > 0 ? page[0].id : null;

    return { messages: page, nextCursor };
}
/** Simulates posting a user message and appending it to the mock data store. */
export async function sendMessage(conversationId: string, content: string): Promise<SendMessageResponse> {
    const now = new Date().toISOString();
    const newMessage: Message = {
        id: 'm-' + Date.now(),
        conversationId,
        sender: 'user',
        content,
        timestamp: now,
    };
    messages.push(newMessage);

    const conversation = conversations.find(c => c.id === conversationId);
    if (conversation) {
        conversation.lastMessage = content;
        conversation.updatedAt = now;
    }

    await new Promise(resolve => setTimeout(resolve, 400));
    return { message: newMessage };
}
