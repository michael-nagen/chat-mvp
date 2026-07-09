import type { ValidateKnowledgeFileResult } from '../KnowledgeUpload.types';

// Only the formats the backend actually ingests today (.txt / .md). MIME types
// are unreliable across browsers, so extension is the primary signal and MIME is
// a fallback. PDF is intentionally unsupported.
export const ALLOWED_KNOWLEDGE_FILE_TYPES = [
  'text/plain',
  'text/markdown',
  'text/x-markdown',
];

export const ALLOWED_KNOWLEDGE_FILE_EXTENSIONS = ['.txt', '.md', '.markdown'];

// `accept` attribute value for the file input (types + extensions).
export const KNOWLEDGE_FILE_ACCEPT = [
  ...ALLOWED_KNOWLEDGE_FILE_EXTENSIONS,
  ...ALLOWED_KNOWLEDGE_FILE_TYPES,
].join(',');

export const MAX_KNOWLEDGE_FILE_SIZE_MB = 2;
export const MAX_KNOWLEDGE_FILE_SIZE_BYTES =
  MAX_KNOWLEDGE_FILE_SIZE_MB * 1024 * 1024;

const PDF_MESSAGE =
  'PDF upload is not supported yet. Please upload a .txt or .md file.';
const UNSUPPORTED_MESSAGE =
  'Unsupported file type. Please upload a .txt or .md file.';
const TOO_LARGE_MESSAGE = `File is too large. Maximum size is ${MAX_KNOWLEDGE_FILE_SIZE_MB}MB.`;

const hasAllowedExtension = (name: string): boolean =>
  ALLOWED_KNOWLEDGE_FILE_EXTENSIONS.some((ext) => name.endsWith(ext));

const hasAllowedType = (type: string): boolean =>
  type !== '' && ALLOWED_KNOWLEDGE_FILE_TYPES.includes(type);

// Frontend (UX) validation only — the backend re-validates type, size, auth, and
// ingestion. Deterministic and side-effect free so it is trivial to unit test.
export function validateKnowledgeFile(file: File): ValidateKnowledgeFileResult {
  const name = file.name.toLowerCase();

  if (name.endsWith('.pdf') || file.type === 'application/pdf') {
    return { ok: false, message: PDF_MESSAGE };
  }
  if (!hasAllowedExtension(name) && !hasAllowedType(file.type)) {
    return { ok: false, message: UNSUPPORTED_MESSAGE };
  }
  if (file.size > MAX_KNOWLEDGE_FILE_SIZE_BYTES) {
    return { ok: false, message: TOO_LARGE_MESSAGE };
  }
  return { ok: true };
}
