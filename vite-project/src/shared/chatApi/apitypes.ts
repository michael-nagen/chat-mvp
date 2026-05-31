import type { Conversation, Message, User } from './../contract/contract';


export type LoginResponse = { token: string; user: User }

export type GetConversationsResponse = { conversations: Conversation[] }

export type GetMessagesResponse = { messages: Message[]; nextCursor: string | null }

export type SendMessageResponse = { message: Message }