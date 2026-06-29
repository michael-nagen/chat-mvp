import { Inject, Injectable } from '@nestjs/common';
import { RECENT_SEARCHES_STORE, RecentSearchesStore } from './recent-searches.store';

@Injectable()
export class RecentSearchesService {
  constructor(
    @Inject(RECENT_SEARCHES_STORE) private readonly store: RecentSearchesStore,
  ) {}

  add({ userId, query }: { userId: string; query: string }): Promise<void> {
    return this.store.addRecent({ userId, query });
  }

  get({ userId }: { userId: string }): Promise<string[]> {
    return this.store.getRecent({ userId });
  }
}
