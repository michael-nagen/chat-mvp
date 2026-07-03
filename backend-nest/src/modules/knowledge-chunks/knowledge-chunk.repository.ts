import { KnowledgeChunk } from '../../common/storage/entities';
import { TxContext } from '../../common/storage/unit-of-work';
import { KnowledgeChunkMatch, KnowledgeChunkSearch } from './knowledge-chunk.types';

// Storage-agnostic port for knowledge chunks. All reads/deletes/searches are
// scoped by userId so chunks are only ever visible to their owner. Writes accept
// an optional tx so ingestion/deletion can run atomically with the document
// write.
export abstract class KnowledgeChunkRepository {
  abstract insertMany(chunks: KnowledgeChunk[], tx?: TxContext): Promise<void>;
  abstract getForDocument(params: {
    userId: string;
    documentId: string;
  }): Promise<KnowledgeChunk[]>;
  abstract deleteForDocument(
    params: { userId: string; documentId: string },
    tx?: TxContext,
  ): Promise<number>;
  abstract countForDocument(params: {
    userId: string;
    documentId: string;
  }): Promise<number>;
  abstract search(params: KnowledgeChunkSearch): Promise<KnowledgeChunkMatch[]>;
  // Fetch one chunk by id, scoped to the owner — for citation-text hydration.
  abstract findByIdForUser(params: {
    chunkId: string;
    userId: string;
  }): Promise<KnowledgeChunk | undefined>;
  abstract createVectorSearchIndex(): Promise<void>;
}
