import { Injectable } from '@nestjs/common';
import { InMemoryStoreService } from '../../memory/in-memory-store.service';
import { KnowledgeDocument } from '../../../common/storage/entities';
import { KnowledgeDocumentRepository } from '../knowledge-document.repository';
import { ConflictException } from '../../../common/errors/app.exception';

// In-memory driver for knowledge documents, backed by the shared store.
@Injectable()
export class InMemoryKnowledgeDocumentRepository extends KnowledgeDocumentRepository {
  constructor(private readonly store: InMemoryStoreService) {
    super();
  }

  insert(document: KnowledgeDocument): Promise<KnowledgeDocument> {
    // Mirrors the Mongo (userId, contentHash) unique index: the loser of a
    // concurrent create (both past the service's findByUserAndHash pre-check)
    // is rejected here.
    if (
      this.store.knowledgeDocuments.some(
        (d) =>
          d.userId === document.userId &&
          d.contentHash === document.contentHash,
      )
    ) {
      throw new ConflictException('Knowledge document already exists.');
    }
    this.store.knowledgeDocuments.push(document);
    return Promise.resolve(document);
  }

  findByUserAndHash({
    userId,
    contentHash,
  }: {
    userId: string;
    contentHash: string;
  }): Promise<KnowledgeDocument | undefined> {
    return Promise.resolve(
      this.store.knowledgeDocuments.find(
        (d) => d.userId === userId && d.contentHash === contentHash,
      ),
    );
  }

  getForUser(userId: string): Promise<KnowledgeDocument[]> {
    const rows = this.store.knowledgeDocuments
      .filter((d) => d.userId === userId)
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
    return Promise.resolve(rows);
  }

  updateChunkCount({
    id,
    userId,
    chunkCount,
  }: {
    id: string;
    userId: string;
    chunkCount: number;
  }): Promise<KnowledgeDocument | undefined> {
    const document = this.store.knowledgeDocuments.find(
      (d) => d.id === id && d.userId === userId,
    );
    if (!document) {
      return Promise.resolve(undefined);
    }
    document.chunkCount = chunkCount;
    return Promise.resolve(document);
  }

  deleteForUser({
    id,
    userId,
  }: {
    id: string;
    userId: string;
  }): Promise<boolean> {
    const index = this.store.knowledgeDocuments.findIndex(
      (d) => d.id === id && d.userId === userId,
    );
    if (index === -1) {
      return Promise.resolve(false);
    }
    this.store.knowledgeDocuments.splice(index, 1);
    return Promise.resolve(true);
  }
}
