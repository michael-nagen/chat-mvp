import { KnowledgeDocument } from '../../common/storage/entities';
import { KnowledgeDocumentResponse } from './knowledge-document.types';

// Strips internal-only fields (userId, contentHash, contentType), exposing only
// what a client needs to display and manage its documents.
export const toKnowledgeDocumentResponse = (
  document: KnowledgeDocument,
): KnowledgeDocumentResponse => ({
  id: document.id,
  fileName: document.fileName,
  status: document.status,
  chunkCount: document.chunkCount,
  createdAt: document.createdAt,
});
