import { User } from './auth.types';
import { KNOWN_USERS } from '../../shared/store/inMemoryStore';

const findById = (userId: string): User | undefined => KNOWN_USERS[userId];

const findByName = (name: string): User | undefined => {
  const normalized = name.trim().toLowerCase();
  return Object.values(KNOWN_USERS).find((user) => user.name.toLowerCase() === normalized);
};

export const authRepository = {
  findById,
  findByName,
};
