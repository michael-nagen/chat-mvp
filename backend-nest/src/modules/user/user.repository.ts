import { User } from '../../common/store/entities';

// Storage-agnostic port. Drivers implement it; the service depends on this
// abstract class, never on a concrete driver.
export abstract class UserRepository {
  abstract findById(id: string): Promise<User | undefined>;
  abstract findByEmail(email: string): Promise<User | undefined>;
  abstract create(user: User): Promise<User>;
}
