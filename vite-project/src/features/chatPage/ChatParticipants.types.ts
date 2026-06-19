import type { UserSummary } from '../../shared/entities/User.types';

export type ChatParticipantsContextValue = {
  /** Resolves a message's senderId to a participant summary, if known. */
  getSender: (senderId: string) => UserSummary | undefined;
  /** Merges participant summaries (e.g. from the loaded conversations) into the map. */
  setParticipants: (participants: UserSummary[]) => void;
};
