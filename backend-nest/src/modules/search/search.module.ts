import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import { SearchRepository } from './search.repository';
import {
  InMemoryRecentSearchesStore,
  RECENT_SEARCHES_STORE,
  RecentSearchesStore,
} from './recent-searches.store';
import { RedisRecentSearchesStore } from './recent-searches.redis';

@Module({
  controllers: [SearchController],
  providers: [
    SearchService,
    SearchRepository,
    {
      provide: RECENT_SEARCHES_STORE,
      inject: [ConfigService],
      // Use real Redis when REDIS_URL connects; otherwise fall back to in-memory so the app still boots.
      useFactory: async (config: ConfigService): Promise<RecentSearchesStore> => {
        const url = config.get<string>('REDIS_URL');
        if (url) {
          try {
            const { default: Redis } = await import('ioredis');
            const client = new Redis(url, { lazyConnect: true, maxRetriesPerRequest: 1 });
            await client.connect();
            return new RedisRecentSearchesStore(client);
          } catch {
            console.warn(
              '[search] REDIS_URL set but Redis is unreachable; using in-memory recent searches.',
            );
          }
        }
        return new InMemoryRecentSearchesStore();
      },
    },
  ],
})
export class SearchModule {}
