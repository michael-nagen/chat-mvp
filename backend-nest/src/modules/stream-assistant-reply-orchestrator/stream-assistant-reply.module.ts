import { Module } from '@nestjs/common';
import { AssistantContextModule } from '../assistant-context/assistant-context.module';
import { AssistantModule } from '../assistant/assistant.module';
import { AgentModule } from '../agent/agent.module';
import { MessagesModule, MESSAGES_DRIVER } from '../messages/messages.module';
import {
  ConversationsModule,
  CONVERSATIONS_DRIVER,
} from '../conversations/conversations.module';
import { unitOfWorkProvider } from '../../common/storage/storage.config';
import { StreamAssistantReplyOrchestrator } from './stream-assistant-reply.orchestrator';
import { AssistantConversationGuard } from './assistant-conversation.guard';


export interface StreamAssistantReplyInput {
  conversationId: string;
  userId: string;
}

@Module({
  imports: [
    AssistantContextModule,
    AssistantModule,
    AgentModule,
    MessagesModule,
    ConversationsModule,
  ],
  providers: [
    StreamAssistantReplyOrchestrator,
    AssistantConversationGuard,
    
    unitOfWorkProvider([MESSAGES_DRIVER, CONVERSATIONS_DRIVER]),
  ],
  exports: [StreamAssistantReplyOrchestrator, AssistantConversationGuard],
})
export class StreamAssistantReplyModule {}
