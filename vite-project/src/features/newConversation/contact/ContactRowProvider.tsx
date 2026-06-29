import type { ReactNode } from 'react';
import type { UserSummary } from '../../../shared/entities/User.types';
import { ContactRowContext } from './ContactRow.context';

type ContactRowProviderProps = {
  contact: UserSummary;
  children: ReactNode;
};

export function ContactRowProvider({
  contact,
  children,
}: ContactRowProviderProps): React.JSX.Element {
  return (
    <ContactRowContext.Provider value={{ contact }}>
      {children}
    </ContactRowContext.Provider>
  );
}
