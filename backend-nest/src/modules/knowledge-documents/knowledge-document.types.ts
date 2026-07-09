import { KnowledgeDocumentStatus } from '../../common/storage/entities';


export interface KnowledgeDocumentResponse {
  id: string;
  fileName: string;
  status: KnowledgeDocumentStatus;
  chunkCount: number;
  createdAt: string;
}

export interface UploadedFileLike {
  originalname: string;
  buffer: Buffer;
  size: number;
  mimetype: string;
}
