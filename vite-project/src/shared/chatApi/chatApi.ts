import type { Message } from './../contract/contract';
import type { GetConversationsResponse, GetMessagesResponse, SendMessageResponse } from './apitypes';
import { conversations, messages } from './mokeapi';


export async function getConversations(): Promise<GetConversationsResponse> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { conversations };
}
export async function getMessages(): Promise<GetMessagesResponse> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { messages };
}

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

    await new Promise(resolve => setTimeout(resolve, 500));
    return { message: newMessage };
}
