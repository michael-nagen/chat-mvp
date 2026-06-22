import { Injectable } from '@nestjs/common';
import { RecentSearchesService } from '../recent-searches/recent-searches.service';
import type {
  GetRecentSearchesInput,
  GetRecentSearchesOutput,
} from './get-recent-searches.module';

@Injectable()
export class GetRecentSearchesOrchestrator {
  constructor(private readonly recentSearches: RecentSearchesService) {}

  async execute({ userId }: GetRecentSearchesInput): Promise<GetRecentSearchesOutput> {
    return { searches: await this.recentSearches.get({ userId }) };
  }
}
