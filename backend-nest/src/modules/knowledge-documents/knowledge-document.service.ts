import { randomUUID } from 'crypto';
import { Injectable } from '@nestjs/common';
import { KnowledgeDocument } from '../../common/storage/entities';
import { NotFoundException } from '../../common/errors/app.exception';
import { TxContext } from '../../common/storage/unit-of-work';
import { KnowledgeDocumentRepository } from './knowledge-document.repository';

interface CreateKnowledgeDocumentInput {
  userId: string;
  fileName: string;
  contentType: string;
  contentHash: string;
}

@Injectable()
export class KnowledgeDocumentService {
  constructor(private readonly repo: KnowledgeDocumentRepository) {}

  // Dedup lookup used by the upload flow to short-circuit before any write.
  findByUserAndHash(params: {
    userId: string;
    contentHash: string;
  }): Promise<KnowledgeDocument | undefined> {
    return this.repo.findByUserAndHash(params);
  }

  // Inserts a new document (status ready, chunkCount 0 until ingestion sets it).
  // Throws ConflictException via the repo if the same (userId, contentHash)
  // already exists — the caller treats that as the idempotent get path.
  create(
    input: CreateKnowledgeDocumentInput,
    tx?: TxContext,
  ): Promise<KnowledgeDocument> {
    return this.repo.insert(this.build(input), tx);
  }

  async updateChunkCount(
    params: { id: string; userId: string; chunkCount: number },
    tx?: TxContext,
  ): Promise<KnowledgeDocument> {
    const updated = await this.repo.updateChunkCount(params, tx);
    if (!updated) {
      // The caller updates a document it just created in the same transaction,
      // so a miss here is an invariant violation rather than a user error.
      throw new NotFoundException('Knowledge document not found.');
    }
    return updated;
  }

  getForUser(userId: string): Promise<KnowledgeDocument[]> {
    return this.repo.getForUser(userId);
  }

  deleteForUser(
    params: { id: string; userId: string },
    tx?: TxContext,
  ): Promise<boolean> {
    return this.repo.deleteForUser(params, tx);
  }

  private build({
    userId,
    fileName,
    contentType,
    contentHash,
  }: CreateKnowledgeDocumentInput): KnowledgeDocument {
    return {
      id: `kd-${randomUUID()}`,
      userId,
      fileName,
      contentType,
      contentHash,
      status: 'ready',
      chunkCount: 0,
      createdAt: new Date().toISOString(),
    };
  }
}
