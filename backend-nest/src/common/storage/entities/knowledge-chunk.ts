// A single chunk of an uploaded knowledge document. The original file/text is
// never stored; only these structure-aware chunks are persisted. `userId` is
// kept on every chunk for user-scoped retrieval, and `documentName` for future
// citations.
export interface KnowledgeChunk {
  id: string;
  userId: string;
  documentId: string;
  documentName: string;
  chunkIndex: number;
  text: string;
  // Embedding vector (OpenAI text-embedding-3-small, 1536 dims) used by Atlas
  // Vector Search. Internal only — never exposed to API callers.
  embedding: number[];
  // ISO-8601 string, consistent with the other entities' timestamps.
  createdAt: string;
}
