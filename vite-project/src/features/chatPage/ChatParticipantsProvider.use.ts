import { useCallback, useState } from 'react';
import type { UserSummary } from '../../shared/entities/User.types';
import type { ChatParticipantsContextValue } from './ChatParticipants.types';

/** Owns the senderId → participant summary map shared across the chat region. */
export function useChatParticipantsController(): ChatParticipantsContextValue {
  const [byId, setById] = useState<Map<string, UserSummary>>(new Map());

  const setParticipants = useCallback((participants: UserSummary[]) => {
    setById((previous) => {
      const next = new Map(previous);
      for (const participant of participants) {
        next.set(participant.id, participant);
      }
      return next;
    });
  }, []);

  const getSender = useCallback(
    (senderId: string): UserSummary | undefined => byId.get(senderId),
    [byId],
  );

  return { getSender, setParticipants };
}
