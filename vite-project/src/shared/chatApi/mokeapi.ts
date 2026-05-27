import type { Conversation, Message} from './../contract/contract';


export const conversations: Conversation[] = [
    {
        id: '1',
        title: 'Chat with Assistant',
        lastMessage: 'Hello! How can I assist you today?',
        updatedAt: new Date().toISOString(),
    },
    {
        id: '2',
        title: 'Project Discussion',
        lastMessage: 'Let\'s discuss the project requirements.',
        updatedAt: new Date().toISOString(),
    },      
]
export const messages: Message[] = [
    {
        id: '1',
        conversationId: '1',
        content: 'Hello! How can I assist you today?',
        sender: 'assistant',
        timestamp: new Date().toISOString(),
    },
    {
        id: '2',
        conversationId: '1',
        content: 'I need help with my project.',
        sender: 'user',
        timestamp: new Date().toISOString(),
    }
]