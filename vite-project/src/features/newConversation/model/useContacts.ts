import { useEffect, useState } from 'react';
import type { UserSummary } from '../../../shared/entities/User.types';
import { getContacts } from './NewConversation.api';

type ContactsState = {
  contacts: UserSummary[];
  isLoading: boolean;
  error: string | null;
};

/** Loads the current user's contacts once on mount; owns its own loading/error. */
export function useContacts(): ContactsState {
  const [contacts, setContacts] = useState<UserSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    getContacts()
      .then((rows) => {
        if (!cancelled) setContacts(rows);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load contacts');
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { contacts, isLoading, error };
}
