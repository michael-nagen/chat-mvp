import { Module } from '@nestjs/common';
import { ConversationsModule } from '../conversations/conversations.module';
import { ConversationResponse } from '../conversations/conversations.types';
import { ConversationParticipantsModule } from '../conversation-participants-resolver/conversation-participants.module';
import { CreateGroupOrchestrator } from './create-group.orchestrator';

export interface CreateGroupInput {
  requestedIds: string[];
  userId: string;
  title?: string;
}

export type CreateGroupOutput = ConversationResponse;

@Module({
  imports: [ConversationsModule, ConversationParticipantsModule],
  providers: [CreateGroupOrchestrator],
  exports: [CreateGroupOrchestrator],
})
export class CreateGroupModule {}
