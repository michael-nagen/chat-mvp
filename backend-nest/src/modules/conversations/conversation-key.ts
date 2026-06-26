import { ConversationType } from '../../common/storage/entities';

// Single owner of the conversation identity-key format: type-namespaced +
// order-independent participants. Identity only — it says nothing about whether
// duplicates are allowed; that policy lives in the use case.
export const toConversationKey = ({
  type,
  participantIds,
}: {
  type: ConversationType;
  participantIds: string[];
}): string => [type, ...[...participantIds].sort()].join(':');
