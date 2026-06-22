import { createContext, useContext } from 'react';
import type { ContactRowProps } from './ContactRow.types';

export const ContactRowContext = createContext<ContactRowProps | null>(null);

export function useContactRowContext(): ContactRowProps {
  const value = useContext(ContactRowContext);
  if (!value) {
    throw new Error('useContactRowContext must be used inside ContactRowProvider');
  }

  return value;
}
