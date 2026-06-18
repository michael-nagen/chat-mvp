import { Module } from '@nestjs/common';
import { ConversationsModule } from '../conversations/conversations.module';
import { ConversationResponse } from '../conversations/conversations.types';
import { UserModule } from '../user/user.module';
import { CreateConversationOrchestrator } from './create-conversation.orchestrator';

export interface CreateConversationInput {
  email: string;
  userId: string;
}

export type CreateConversationOutput = ConversationResponse;

@Module({
  imports: [ConversationsModule, UserModule],
  providers: [CreateConversationOrchestrator],
  exports: [CreateConversationOrchestrator],
})
export class CreateConversationModule {}
