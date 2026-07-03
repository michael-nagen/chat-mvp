import {
  RetrievedKnowledgeChunk,
  RetrieveKnowledgeChunksInput,
} from '../rag-tutor.types';

// Retrieval contract the RAG tutor depends on. The tutor must not know whether
// results come from a mock, in-memory, Mongo, or Atlas Vector Search — only that
// it receives scored, user-scoped chunks. The real Part-5 knowledge-chunks
// retrieval will implement this same abstraction later.
export abstract class KnowledgeRetrievalService {
  abstract retrieve(
    input: RetrieveKnowledgeChunksInput,
  ): Promise<RetrievedKnowledgeChunk[]>;
}
