import { User } from '../auth.types';

export const KNOWN_USERS: Record<string, User> = {
  u1: { id: 'u1', name: 'Alice' },
  u2: { id: 'u2', name: 'Bob' },
};
