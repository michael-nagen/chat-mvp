// A reference to a source chunk that grounded an assistant (tutor) answer.
// Reference only — no embeddings and no chunk text. The text stays in Atlas
// (knowledge_chunks) and is hydrated on demand via chunkId.
export interface MessageCitation {
  chunkId: string;
  documentId: string;
  documentName: string;
  chunkIndex: number;
  score: number;
}

// Optional, extensible per-message metadata. Tutor answers carry citation refs;
// a knowledge-upload event message carries kind + document info. Normal user
// messages have none.
export interface MessageMetadata {
  citations?: MessageCitation[];
  // Marks a lightweight UI event message (e.g. a knowledge upload notice). The
  // document/chunk content itself lives only in Atlas, never here.
  kind?: 'knowledge_upload';
  documentId?: string;
  documentName?: string;
  status?: 'completed' | 'failed';
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  createdAt: string;
  // Present only when a message carries extra data (e.g. tutor citations).
  metadata?: MessageMetadata;
}
