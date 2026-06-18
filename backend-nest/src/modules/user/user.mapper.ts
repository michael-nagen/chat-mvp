import { User } from '../memory/entities';
import { UserResponse } from './user.types';

// password is internal and never exposed on the wire.
export const toUserResponse = (user: User): UserResponse => ({
  id: user.id,
  email: user.email,
  name: user.name,
});
