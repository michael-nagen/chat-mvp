import { User } from '../auth.types';
import { KNOWN_USERS } from './data';

export const findById = (userId: string): User | undefined => KNOWN_USERS[userId];
