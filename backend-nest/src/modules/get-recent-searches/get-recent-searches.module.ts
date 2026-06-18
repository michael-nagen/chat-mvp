import { Module } from '@nestjs/common';
import { RecentSearchesModule } from '../recent-searches/recent-searches.module';
import { RecentSearchesResponse } from './get-recent-searches.types';
import { GetRecentSearchesOrchestrator } from './get-recent-searches.orchestrator';

export interface GetRecentSearchesInput {
  userId: string;
}

export type GetRecentSearchesOutput = RecentSearchesResponse;

@Module({
  imports: [RecentSearchesModule],
  providers: [GetRecentSearchesOrchestrator],
  exports: [GetRecentSearchesOrchestrator],
})
export class GetRecentSearchesModule {}
