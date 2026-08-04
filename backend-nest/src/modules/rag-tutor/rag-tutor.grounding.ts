import type { RagTutorCitation, RetrievedKnowledgeChunk } from './rag-tutor.types';

// Grounding policy for the tutor LangGraph (and eval helpers) so the
// threshold/citation rules have a single owner. Retrieval may not enforce
// minScore, so callers re-apply it here.
export const selectStrongChunks = (
  chunks: RetrievedKnowledgeChunk[],
  minScore: number,
): RetrievedKnowledgeChunk[] =>
  chunks.filter((chunk) => chunk.score >= minScore);

// A strong chunk exposed as a citation: a reference only (ids + score), never
// the chunk text or embedding.
export const toRagTutorCitation = (
  chunk: RetrievedKnowledgeChunk,
): RagTutorCitation => ({
  chunkId: chunk.chunkId,
  documentId: chunk.documentId,
  documentName: chunk.documentName,
  chunkIndex: chunk.chunkIndex,
  score: chunk.score,
});
