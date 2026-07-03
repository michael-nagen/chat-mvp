import { randomUUID } from 'crypto';
import { Injectable } from '@nestjs/common';
import { KnowledgeChunk } from '../../common/storage/entities';
import { TxContext } from '../../common/storage/unit-of-work';
import { KnowledgeChunkRepository } from './knowledge-chunk.repository';
import {
  KnowledgeChunkMatch,
  KnowledgeChunkSearch,
} from './knowledge-chunk.types';

@Injectable()
export class KnowledgeChunkService {
  constructor(private readonly repo: KnowledgeChunkRepository) {}

  async createForDocument(
    {
      userId,
      documentId,
      documentName,
      texts,
      embeddings,
    }: {
      userId: string;
      documentId: string;
      documentName: string;
      texts: string[];
      embeddings: number[][];
    },
    tx?: TxContext,
  ): Promise<KnowledgeChunk[]> {
    const createdAt = new Date().toISOString();
    const chunks: KnowledgeChunk[] = texts.map((text, chunkIndex) => ({
      id: `kc-${randomUUID()}`,
      userId,
      documentId,
      documentName,
      chunkIndex,
      text,
      embedding: embeddings[chunkIndex],
      createdAt,
    }));
    await this.repo.insertMany(chunks, tx);
    return chunks;
  }

  search(params: KnowledgeChunkSearch): Promise<KnowledgeChunkMatch[]> {
    return this.repo.search(params);
  }

  findByIdForUser(params: {
    chunkId: string;
    userId: string;
  }): Promise<KnowledgeChunk | undefined> {
    return this.repo.findByIdForUser(params);
  }

  getForDocument(params: {
    userId: string;
    documentId: string;
  }): Promise<KnowledgeChunk[]> {
    return this.repo.getForDocument(params);
  }

  deleteForDocument(
    params: { userId: string; documentId: string },
    tx?: TxContext,
  ): Promise<number> {
    return this.repo.deleteForDocument(params, tx);
  }

  countForDocument(params: {
    userId: string;
    documentId: string;
  }): Promise<number> {
    return this.repo.countForDocument(params);
  }
}
