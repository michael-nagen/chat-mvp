export type KnowledgeDocumentStatus = 'ready' | 'failed';

export interface KnowledgeDocument {
  id: string;
  userId: string;
  fileName: string;
  contentType: string;
  contentHash: string;
  status: KnowledgeDocumentStatus;
  chunkCount: number;
  // ISO-8601 string, consistent with the other entities' timestamps.
  createdAt: string;
}
