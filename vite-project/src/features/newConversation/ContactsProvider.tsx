import type { ReactNode } from 'react';
import { ContactsContext } from './Contacts.context';
import { useContacts } from './model/useContacts';

/** Loads contacts once for the modal subtree so both steps share one fetch. */
export function ContactsProvider({
  children,
}: {
  children: ReactNode;
}): React.JSX.Element {
  const value = useContacts();

  return (
    <ContactsContext.Provider value={value}>{children}</ContactsContext.Provider>
  );
}
