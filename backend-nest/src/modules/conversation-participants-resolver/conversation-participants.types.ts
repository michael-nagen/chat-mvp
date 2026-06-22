import { UserSummary } from '../user/user.types';

// `min`/`max` bound the *other* participants (the current user is added by the
// resolver and excluded from the count).
export interface ResolveParticipantsInput {
  requestedIds: string[];
  currentUserId: string;
  min: number;
  max: number;
}

export interface ResolvedParticipants {
  // Current user first, then the distinct, validated others.
  participantIds: string[];
  participants: UserSummary[];
}
