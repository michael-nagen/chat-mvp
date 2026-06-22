import { User } from '../../common/storage/entities';
import { UserResponse, UserSummary, UserSummarySource } from './user.types';

// password is internal and never exposed on the wire.
export const toUserResponse = (user: User): UserResponse => ({
  id: user.id,
  email: user.email,
  firstName: user.firstName,
  lastName: user.lastName,
  displayName: `${user.firstName} ${user.lastName}`,
  avatarUrl: user.avatarUrl ?? null,
});

// Public summary for other users — no email or internal fields.
export const toUserSummary = (user: UserSummarySource): UserSummary => ({
  id: user.id,
  displayName: `${user.firstName} ${user.lastName}`,
  avatarUrl: user.avatarUrl ?? null,
});
