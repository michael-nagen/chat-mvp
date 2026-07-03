import { Injectable } from '@nestjs/common';
import { InMemoryStoreService } from '../../memory/in-memory-store.service';
import { KnowledgeChunk } from '../../../common/storage/entities';
import { KnowledgeChunkRepository } from '../knowledge-chunk.repository';
import {
  KnowledgeChunkMatch,
  KnowledgeChunkSearch,
} from '../knowledge-chunk.types';

// In-memory driver for knowledge chunks, backed by the shared store. The tx
// handle is ignored — the in-memory unit of work is a no-op.
@Injectable()
export class InMemoryKnowledgeChunkRepository extends KnowledgeChunkRepository {
  constructor(private readonly store: InMemoryStoreService) {
    super();
  }

  insertMany(chunks: KnowledgeChunk[]): Promise<void> {
    this.store.knowledgeChunks.push(...chunks);
    return Promise.resolve();
  }

  getForDocument({
    userId,
    documentId,
  }: {
    userId: string;
    documentId: string;
  }): Promise<KnowledgeChunk[]> {
    const rows = this.store.knowledgeChunks
      .filter((c) => c.userId === userId && c.documentId === documentId)
      .sort((a, b) => a.chunkIndex - b.chunkIndex);
    return Promise.resolve(rows);
  }

  deleteForDocument({
    userId,
    documentId,
  }: {
    userId: string;
    documentId: string;
  }): Promise<number> {
    const remaining = this.store.knowledgeChunks.filter(
      (c) => !(c.userId === userId && c.documentId === documentId),
    );
    const deleted = this.store.knowledgeChunks.length - remaining.length;
    this.store.knowledgeChunks.splice(
      0,
      this.store.knowledgeChunks.length,
      ...remaining,
    );
    return Promise.resolve(deleted);
  }

  countForDocument({
    userId,
    documentId,
  }: {
    userId: string;
    documentId: string;
  }): Promise<number> {
    const count = this.store.knowledgeChunks.filter(
      (c) => c.userId === userId && c.documentId === documentId,
    ).length;
    return Promise.resolve(count);
  }

  // Mirrors the Atlas cosine search deterministically: score the user's chunks
  // by cosine similarity, keep those at/above minScore, sort descending, take
  // the top `limit`, and strip the embedding.
  // No vector index in memory — retrieval scores in-process (see search).
  createVectorSearchIndex(): Promise<void> {
    return Promise.resolve();
  }

  search({
    userId,
    embedding,
    limit,
    minScore,
  }: KnowledgeChunkSearch): Promise<KnowledgeChunkMatch[]> {
    const matches = this.store.knowledgeChunks
      .filter((c) => c.userId === userId)
      .map((c) => ({
        chunkId: c.id,
        documentId: c.documentId,
        documentName: c.documentName,
        chunkIndex: c.chunkIndex,
        text: c.text,
        score: cosineSimilarity(embedding, c.embedding),
      }))
      .filter((match) => match.score >= minScore)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
    return Promise.resolve(matches);
  }

  findByIdForUser({
    chunkId,
    userId,
  }: {
    chunkId: string;
    userId: string;
  }): Promise<KnowledgeChunk | undefined> {
    return Promise.resolve(
      this.store.knowledgeChunks.find(
        (c) => c.id === chunkId && c.userId === userId,
      ),
    );
  }
}

function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i++) {
    const ai = a[i];
    const bi = b[i] ?? 0;
    dot += ai * bi;
    normA += ai * ai;
    normB += bi * bi;
  }
  const denom = Math.sqrt(normA) * Math.sqrt(normB);
  return denom === 0 ? 0 : dot / denom;
}
