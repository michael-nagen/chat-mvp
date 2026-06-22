import { Module } from '@nestjs/common';
import { MessagesModule } from '../messages/messages.module';
import { MessagePageResponse } from '../messages/messages.types';
import { ConversationsModule } from '../conversations/conversations.module';
import { ListMessagesOrchestrator } from './list-messages.orchestrator';

export interface ListMessagesInput {
  conversationId: string;
  userId: string;
  cursor?: string;
  limit: number;
}

export type ListMessagesOutput = MessagePageResponse;

@Module({
  imports: [MessagesModule, ConversationsModule],
  providers: [ListMessagesOrchestrator],
  exports: [ListMessagesOrchestrator],
})
export class ListMessagesModule {}
