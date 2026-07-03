export type SenderRole = 'user' | 'assistant';

// A reference to a source chunk that grounded a tutor answer. Reference only —
// no embeddings and no chunk text (text is hydrated on demand by chunkId).
export type MessageCitation = {
  chunkId: string;
  documentId: string;
  documentName: string;
  chunkIndex: number;
  score: number;
};

// Optional per-message metadata: tutor answers carry citation refs; a knowledge
// upload event carries kind + document info. Normal messages carry none.
export type MessageMetadata = {
  citations?: MessageCitation[];
  kind?: 'knowledge_upload';
  documentId?: string;
  documentName?: string;
  status?: 'completed' | 'failed';
};

export type Message = {
  id: string;
  conversationId: string;
  content: string;
  sender: SenderRole;
  // Raw author id, kept for resolving the sender's avatar/name from participants.
  senderId: string;
  timestamp: string;
  metadata?: MessageMetadata;
};

// Wire shape from the backend: senderId is the raw author id, mapped to a caller-relative sender.
export type RawMessage = {
  id: string;
  conversationId: string;
  content: string;
  senderId: string;
  timestamp: string;
  metadata?: MessageMetadata;
};
