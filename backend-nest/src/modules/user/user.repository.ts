import { User } from '../memory/entities';
import { UserUpdate } from './user.types';

// Storage-agnostic port. Drivers implement it; the service depends on this
// abstract class, never on a concrete driver.
export abstract class UserRepository {
  abstract findById(id: string): Promise<User | undefined>;
  // Batch lookup; returned order is not guaranteed and missing ids are omitted.
  abstract findByIds(ids: string[]): Promise<User[]>;
  abstract findByEmail(email: string): Promise<User | undefined>;
  abstract create(user: User): Promise<User>;
  // Applies a partial patch to an existing user; undefined when no such id.
  abstract update(id: string, patch: UserUpdate): Promise<User | undefined>;
}
