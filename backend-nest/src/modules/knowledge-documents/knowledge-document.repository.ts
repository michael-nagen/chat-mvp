import { KnowledgeDocument } from '../../common/storage/entities';
import { TxContext } from '../../common/storage/unit-of-work';

// Storage-agnostic port. Drivers implement it; the service depends on this
// abstract class, never on a concrete driver. All reads/deletes are scoped by
// userId so a document is only ever visible to its owner. Writes accept an
// optional tx so the document write can run atomically with its chunk writes.
export abstract class KnowledgeDocumentRepository {
  abstract insert(
    document: KnowledgeDocument,
    tx?: TxContext,
  ): Promise<KnowledgeDocument>;
  abstract findByUserAndHash(params: {
    userId: string;
    contentHash: string;
  }): Promise<KnowledgeDocument | undefined>;
  abstract getForUser(userId: string): Promise<KnowledgeDocument[]>;
  // Returns the updated document, or undefined when no document with that id is
  // owned by the user.
  abstract updateChunkCount(
    params: { id: string; userId: string; chunkCount: number },
    tx?: TxContext,
  ): Promise<KnowledgeDocument | undefined>;
  // Returns true when a document owned by the user was deleted, false when no
  // such document exists for that user (missing or owned by someone else).
  abstract deleteForUser(
    params: { id: string; userId: string },
    tx?: TxContext,
  ): Promise<boolean>;
}
