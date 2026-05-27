import type { Conversation, Message } from './../contract/contract';


export type GetConversationsResponse = { conversations: Conversation[] }

export type GetMessagesResponse = { messages: Message[] }

export type SendMessageResponse = { message: Message }