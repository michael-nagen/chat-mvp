import { Module } from '@nestjs/common';
import { ConversationsModule } from '../conversations/conversations.module';
import { ConversationResponse } from '../conversations/conversations.types';
import { ConversationParticipantsModule } from '../conversation-participants-resolver/conversation-participants.module';
import { CreateDmOrchestrator } from './create-dm.orchestrator';

export interface CreateDmInput {
  requestedIds: string[];
  userId: string;
}

export interface CreateDmOutput {
  conversation: ConversationResponse;
  // True when an existing DM was returned (200) rather than created (201).
  alreadyExisted: boolean;
}

@Module({
  imports: [ConversationsModule, ConversationParticipantsModule],
  providers: [CreateDmOrchestrator],
  exports: [CreateDmOrchestrator],
})
export class CreateDmModule {}
