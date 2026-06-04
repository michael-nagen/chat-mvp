import { User } from '../auth.types';
import { KNOWN_USERS } from './data';

export const findByName = (name: string): User | undefined => {
  const normalized = name.trim().toLowerCase();
  return Object.values(KNOWN_USERS).find((user) => user.name.toLowerCase() === normalized);
};
