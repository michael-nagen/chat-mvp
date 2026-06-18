import { Module } from '@nestjs/common';
import { ConversationsModule } from '../conversations/conversations.module';
import { ConversationResponse } from '../conversations/conversations.types';
import { ListConversationsOrchestrator } from './list-conversations.orchestrator';

export interface ListConversationsInput {
  userId: string;
}

export interface ListConversationsOutput {
  conversations: ConversationResponse[];
}

@Module({
  imports: [ConversationsModule],
  providers: [ListConversationsOrchestrator],
  exports: [ListConversationsOrchestrator],
})
export class ListConversationsModule {}
