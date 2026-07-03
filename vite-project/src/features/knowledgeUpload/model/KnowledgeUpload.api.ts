import {
  apiUrl,
  extractErrorMessage,
  getAuthToken,
  get,
} from '../../../shared/api/apiClient';
import type {
  KnowledgeChunkSource,
  UploadKnowledgeDocumentResponse,
} from '../KnowledgeUpload.types';

// Multipart upload to POST /knowledge/documents. The shared apiClient forces
// application/json, so we use fetch directly here — but reuse the client's base
// URL, bearer token, and error-envelope parsing. Content-Type is deliberately
// NOT set so the browser adds the multipart boundary itself. conversationId, when
// given, makes the backend post an upload event message into that conversation.
export async function uploadKnowledgeDocument({
  file,
  conversationId,
}: {
  file: File;
  conversationId?: string;
}): Promise<UploadKnowledgeDocumentResponse> {
  const formData = new FormData();
  formData.append('file', file);
  if (conversationId) formData.append('conversationId', conversationId);

  const token = getAuthToken();
  const res = await fetch(apiUrl('/knowledge/documents'), {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });

  const payload: unknown = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(
      extractErrorMessage(payload, `Upload failed (${res.status})`),
    );
  }
  return payload as UploadKnowledgeDocumentResponse;
}

// Hydrates a citation's source text from Atlas by chunkId (never embeddings).
export function getKnowledgeChunk(chunkId: string): Promise<KnowledgeChunkSource> {
  return get<KnowledgeChunkSource>(`/knowledge/chunks/${chunkId}`);
}
