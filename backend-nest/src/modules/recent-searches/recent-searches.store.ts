export const RECENT_SEARCHES_STORE = Symbol('RECENT_SEARCHES_STORE');

export const RECENT_LIMIT = 10;

export const recentSearchesKey = (userId: string): string =>
  `recent-searches:${userId}`;

export interface RecentSearchesStore {
  addRecent(args: { userId: string; query: string }): Promise<void>;
  getRecent(args: { userId: string }): Promise<string[]>;
}

// In-memory stand-in with the same semantics as the Redis list ops (dedupe, prepend, cap).
export class InMemoryRecentSearchesStore implements RecentSearchesStore {
  private readonly lists = new Map<string, string[]>();

  addRecent({ userId, query }: { userId: string; query: string }): Promise<void> {
    const key = recentSearchesKey(userId);
    const withoutDupe = (this.lists.get(key) ?? []).filter((item) => item !== query);
    this.lists.set(key, [query, ...withoutDupe].slice(0, RECENT_LIMIT));
    return Promise.resolve();
  }

  getRecent({ userId }: { userId: string }): Promise<string[]> {
    return Promise.resolve(this.lists.get(recentSearchesKey(userId)) ?? []);
  }
}
