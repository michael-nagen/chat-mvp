import { createContext, useContext } from 'react';
import type { CitationSource } from './MessageCitations.types';

export const MessageCitationsContext = createContext<CitationSource | null>(null);

export function useCitationSource(): CitationSource {
  const value = useContext(MessageCitationsContext);
  if (!value) {
    throw new Error('useCitationSource must be used inside MessageCitations');
  }

  return value;
}
