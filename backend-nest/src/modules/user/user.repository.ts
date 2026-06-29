import { User } from '../../common/storage/entities';
import { UserSummarySource, UserUpdate } from './user.types';

// Storage-agnostic port. Drivers implement it; the service depends on this
// abstract class, never on a concrete driver.
export abstract class UserRepository {
  abstract findById(id: string): Promise<User | undefined>;
  // Batch summary lookup; returned order is not guaranteed and missing ids are
  // omitted. Projects only summary fields, never passwordHash or email.
  abstract findByIds(ids: string[]): Promise<UserSummarySource[]>;
  abstract findByEmail(email: string): Promise<User | undefined>;
  abstract create(user: User): Promise<User>;
  // Applies a partial patch to an existing user; undefined when no such id.
  abstract update(id: string, patch: UserUpdate): Promise<User | undefined>;
}
