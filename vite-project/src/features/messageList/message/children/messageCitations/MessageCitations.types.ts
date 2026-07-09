import type { MessageCitation } from '../../../../../shared/entities/Message.types';

export type UseMessageCitations = {
  citations: MessageCitation[];
  isSourceOpen: (chunkId: string) => boolean;
  isSourceLoading: (chunkId: string) => boolean;
  // Truncated preview text for a source, or null when it is closed or still
  // loading (so the component renders nothing for it yet).
  getSourcePreview: (chunkId: string) => string | null;
  // Opens a source (fetching it once) or closes it if it is already open.
  toggleSource: (chunkId: string) => void;
};

// The per-chunk source accessors shared with each CitationItem via context, so a
// row reads its own open/loading/preview state without prop drilling.
export type CitationSource = Omit<UseMessageCitations, 'citations'>;

export type CitationItemProps = {
  citation: MessageCitation;
  index: number;
};
