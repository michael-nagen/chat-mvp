import { createContext, useContext } from 'react';
import type { UserSummary } from '../../shared/entities/User.types';

export type ContactsContextValue = {
  contacts: UserSummary[];
  isLoading: boolean;
  error: string | null;
};

export const ContactsContext = createContext<ContactsContextValue | null>(null);

export function useContactsContext(): ContactsContextValue {
  const value = useContext(ContactsContext);
  if (!value) {
    throw new Error('useContactsContext must be used inside ContactsProvider');
  }

  return value;
}
