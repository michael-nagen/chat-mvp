import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model } from 'mongoose';
import { KnowledgeChunk } from '../../../common/storage/entities';
import { TxContext } from '../../../common/storage/unit-of-work';
import { KnowledgeChunkRepository } from '../knowledge-chunk.repository';
import {
  KnowledgeChunkMatch,
  KnowledgeChunkSearch,
} from '../knowledge-chunk.types';
import {
  KnowledgeChunkDoc,
  KnowledgeChunkDocument,
  KNOWLEDGE_CHUNK_VECTOR_INDEX,
  knowledgeChunkVectorSearchIndex,
} from './knowledge-chunk.schema';
import { KNOWLEDGE_CONNECTION } from '../../knowledge-storage/knowledge-mongo-connection.module';

// Over-fetch candidates relative to the requested limit so Atlas vector search
// has enough recall before the userId filter + score cut are applied.
const NUM_CANDIDATES_FACTOR = 20;
const MIN_NUM_CANDIDATES = 100;

// Mongo driver for knowledge chunks.
@Injectable()
export class MongoKnowledgeChunkRepository extends KnowledgeChunkRepository {
  constructor(
    @InjectModel(KnowledgeChunkDoc.name, KNOWLEDGE_CONNECTION)
    private readonly model: Model<KnowledgeChunkDocument>,
  ) {
    super();
  }

  async insertMany(chunks: KnowledgeChunk[], tx?: TxContext): Promise<void> {
    if (chunks.length === 0) {
      return;
    }
    await this.model.create(
      chunks.map((chunk) => ({
        _id: chunk.id,
        userId: chunk.userId,
        documentId: chunk.documentId,
        documentName: chunk.documentName,
        chunkIndex: chunk.chunkIndex,
        text: chunk.text,
        embedding: chunk.embedding,
        createdAt: new Date(chunk.createdAt),
      })),
      // Mongoose requires ordered:true to create() an array within a session.
      { session: tx as ClientSession | undefined, ordered: true },
    );
  }

  async getForDocument({
    userId,
    documentId,
  }: {
    userId: string;
    documentId: string;
  }): Promise<KnowledgeChunk[]> {
    const docs = await this.model
      .find({ userId, documentId })
      .sort({ chunkIndex: 1 })
      .lean()
      .exec();
    return docs.map((doc) => this.toEntity(doc));
  }

  async deleteForDocument(
    {
      userId,
      documentId,
    }: {
      userId: string;
      documentId: string;
    },
    tx?: TxContext,
  ): Promise<number> {
    const result = await this.model
      .deleteMany(
        { userId, documentId },
        { session: tx as ClientSession | undefined },
      )
      .exec();
    return result.deletedCount ?? 0;
  }

  countForDocument({
    userId,
    documentId,
  }: {
    userId: string;
    documentId: string;
  }): Promise<number> {
    return this.model.countDocuments({ userId, documentId }).exec();
  }

  // Atlas Vector Search: pre-filter by userId, score by cosine similarity, drop
  // anything below minScore, and project away the embedding (and _id) so callers
  // never receive vectors.
  async search({
    userId,
    embedding,
    limit,
    minScore,
  }: KnowledgeChunkSearch): Promise<KnowledgeChunkMatch[]> {
    const rows = await this.model
      .aggregate<KnowledgeChunkMatch>([
        {
          $vectorSearch: {
            index: KNOWLEDGE_CHUNK_VECTOR_INDEX,
            path: 'embedding',
            queryVector: embedding,
            numCandidates: Math.max(limit * NUM_CANDIDATES_FACTOR, MIN_NUM_CANDIDATES),
            limit,
            filter: { userId },
          },
        },
        { $set: { score: { $meta: 'vectorSearchScore' } } },
        { $match: { score: { $gte: minScore } } },
        {
          $project: {
            _id: 0,
            chunkId: '$_id',
            documentId: 1,
            documentName: 1,
            chunkIndex: 1,
            text: 1,
            score: 1,
          },
        },
      ])
      .exec();
    return rows;
  }

  async findByIdForUser({
    chunkId,
    userId,
  }: {
    chunkId: string;
    userId: string;
  }): Promise<KnowledgeChunk | undefined> {
    const doc = await this.model.findOne({ _id: chunkId, userId }).lean().exec();
    return doc ? this.toEntity(doc) : undefined;
  }

  // Creates the Atlas Vector Search index (idempotent-ish: skips if present).
  // Atlas-only — invoked manually via the create:knowledge-index script, never
  // on app boot, since createSearchIndex errors on non-Atlas deployments.
  async createVectorSearchIndex(): Promise<void> {
    const existing = await this.model.collection.listSearchIndexes().toArray();
    if (existing.some((index) => index.name === KNOWLEDGE_CHUNK_VECTOR_INDEX)) {
      return;
    }
    await this.model.collection.createSearchIndex(knowledgeChunkVectorSearchIndex);
  }

  private toEntity(doc: KnowledgeChunkDoc): KnowledgeChunk {
    return {
      id: doc._id,
      userId: doc.userId,
      documentId: doc.documentId,
      documentName: doc.documentName,
      chunkIndex: doc.chunkIndex,
      text: doc.text,
      embedding: doc.embedding,
      createdAt: doc.createdAt.toISOString(),
    };
  }
}
