// A retrieval hit: the chunk fields a caller is allowed to see plus the
// similarity score. Embeddings are deliberately excluded — they never leave the
// storage layer. chunkId is the stable id used to hydrate source text later.
export interface KnowledgeChunkMatch {
  chunkId: string;
  documentId: string;
  documentName: string;
  chunkIndex: number;
  text: string;
  score: number;
}

// A chunk exposed for citation-text hydration: its identifying fields + text,
// never the embedding.
export interface KnowledgeChunkView {
  chunkId: string;
  documentId: string;
  documentName: string;
  chunkIndex: number;
  text: string;
}

// Vector-search query parameters, always scoped to one user.
export interface KnowledgeChunkSearch {
  userId: string;
  embedding: number[];
  limit: number;
  minScore: number;
}
