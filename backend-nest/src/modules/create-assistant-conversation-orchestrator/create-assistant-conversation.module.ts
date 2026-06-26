import { Module } from '@nestjs/common';
import { ConversationsModule } from '../conversations/conversations.module';
import { ConversationResponse } from '../conversations/conversations.types';
import { ConversationParticipantsModule } from '../conversation-participants-resolver/conversation-participants.module';
import { AssistantModule } from '../assistant/assistant.module';
import { CreateAssistantConversationOrchestrator } from './create-assistant-conversation.orchestrator';

export interface CreateAssistantConversationInput {
  userId: string;
  // Optional client title; a default is applied when omitted.
  title?: string;
}

export type CreateAssistantConversationOutput = ConversationResponse;

@Module({
  imports: [ConversationsModule, ConversationParticipantsModule, AssistantModule],
  providers: [CreateAssistantConversationOrchestrator],
  exports: [CreateAssistantConversationOrchestrator],
})
export class CreateAssistantConversationModule {}
