import { UserSummary } from '../user/user.types';

// A conversation's display title: the other participants' names. The viewer
// already knows who they are, so their own name is excluded. Used as a DM's
// title and as a group's fallback when no explicit title was provided.
export const deriveConversationTitle = ({
  participants,
  currentUserId,
}: {
  participants: UserSummary[];
  currentUserId: string;
}): string =>
  participants
    .filter((participant) => participant.id !== currentUserId)
    .map((participant) => participant.displayName)
    .join(', ');
