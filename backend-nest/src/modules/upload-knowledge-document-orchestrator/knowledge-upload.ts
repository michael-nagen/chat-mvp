import { createHash } from 'crypto';
import { extname } from 'path';
import { ValidationException } from '../../common/errors/app.exception';
import { UploadedFileLike } from '../knowledge-documents/knowledge-document.types';

const MAX_UPLOAD_BYTES = 3 * 1024 * 1024; // 3MB


const ALLOWED_EXTENSIONS: Record<string, string> = {
  '.txt': 'text/plain',
  '.md': 'text/markdown',
};

export interface ParsedKnowledgeUpload {
  fileName: string;
  contentType: string;
  contentHash: string;
  text: string;
}

export function parseKnowledgeUpload(
  file?: UploadedFileLike,
): ParsedKnowledgeUpload {
  if (!file?.buffer) {
    throw new ValidationException('No file was uploaded.');
  }

  const fileName = file.originalname;
  const contentType = ALLOWED_EXTENSIONS[extname(fileName).toLowerCase()];
  if (!contentType) {
    throw new ValidationException('Only .txt and .md files are supported.');
  }

  if (file.buffer.length > MAX_UPLOAD_BYTES) {
    throw new ValidationException('File exceeds the 3MB size limit.');
  }

  const text = file.buffer.toString('utf-8');
  if (text.trim().length === 0) {
    throw new ValidationException('File content is empty.');
  }

  const contentHash = createHash('sha256').update(file.buffer).digest('hex');
  return { fileName, contentType, contentHash, text };
}
