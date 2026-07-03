// A chunk returned by retrieval. Mirrors the knowledge-chunks retrieval shape
// but is defined here so the RAG tutor depends only on this contract — never on
// the chunk storage layer or embeddings. Embeddings are intentionally absent.
export type RetrievedKnowledgeChunk = {
  chunkId: string;
  documentId: string;
  documentName: string;
  chunkIndex: number;
  text: string;
  score: number;
};

export type RetrieveKnowledgeChunksInput = {
  userId: string;
  question: string;
  topK?: number;
  minScore?: number;
};

// Structured citation returned alongside an answer. A stable reference only —
// no embeddings and no chunk text (text is hydrated on demand from Atlas by
// chunkId).
export type RagTutorCitation = {
  chunkId: string;
  documentId: string;
  documentName: string;
  chunkIndex: number;
  score: number;
};

export type AnswerTutorQuestionInput = {
  userId: string;
  question: string;
};

export type RagTutorAnswer = {
  answer: string;
  citations: RagTutorCitation[];
};
