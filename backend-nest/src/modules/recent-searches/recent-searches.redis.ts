import type { Redis } from 'ioredis';
import {
  RECENT_LIMIT,
  RecentSearchesStore,
  recentSearchesKey,
} from './recent-searches.store';

// Real Redis list: LREM removes any prior copy, LPUSH puts it on top, LTRIM caps the length.
export class RedisRecentSearchesStore implements RecentSearchesStore {
  constructor(private readonly client: Redis) {}

  async addRecent({ userId, query }: { userId: string; query: string }): Promise<void> {
    const key = recentSearchesKey(userId);
    await this.client.lrem(key, 0, query);
    await this.client.lpush(key, query);
    await this.client.ltrim(key, 0, RECENT_LIMIT - 1);
  }

  getRecent({ userId }: { userId: string }): Promise<string[]> {
    return this.client.lrange(recentSearchesKey(userId), 0, RECENT_LIMIT - 1);
  }
}
