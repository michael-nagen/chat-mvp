import { Module } from '@nestjs/common';
import { ConversationsModule } from '../conversations/conversations.module';
import { ConversationResponse } from '../conversations/conversations.types';
import { ConversationParticipantsModule } from '../conversation-participants-resolver/conversation-participants.module';
import { AssistantModule } from '../assistant/assistant.module';
import { CreateTutorConversationOrchestrator } from './create-tutor-conversation.orchestrator';

export interface CreateTutorConversationInput {
  userId: string;
}

export type CreateTutorConversationOutput = ConversationResponse;

@Module({
  imports: [ConversationsModule, ConversationParticipantsModule, AssistantModule],
  providers: [CreateTutorConversationOrchestrator],
  exports: [CreateTutorConversationOrchestrator],
})
export class CreateTutorConversationModule {}
