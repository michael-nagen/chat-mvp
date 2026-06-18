import { Module } from '@nestjs/common';
import { ConversationsModule } from '../conversations/conversations.module';
import { MessagesModule } from '../messages/messages.module';
import { RecentSearchesModule } from '../recent-searches/recent-searches.module';
import { MessageSearchResponse } from './search-messages.types';
import { SearchMessagesOrchestrator } from './search-messages.orchestrator';

export interface SearchMessagesInput {
  userId: string;
  query: string;
  cursor?: string;
  limit: number;
}

export type SearchMessagesOutput = MessageSearchResponse;

@Module({
  imports: [ConversationsModule, MessagesModule, RecentSearchesModule],
  providers: [SearchMessagesOrchestrator],
  exports: [SearchMessagesOrchestrator],
})
export class SearchMessagesModule {}
