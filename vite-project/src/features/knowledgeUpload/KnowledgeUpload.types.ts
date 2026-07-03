// Public view of an uploaded knowledge document (backend response; no embeddings).
export type KnowledgeDocumentResponse = {
  id: string;
  fileName: string;
  status: 'ready' | 'failed';
  chunkCount: number;
  createdAt: string;
};

// POST /knowledge/documents response envelope: the document + whether identical
// content was already uploaded (idempotent).
export type UploadKnowledgeDocumentResponse = {
  document: KnowledgeDocumentResponse;
  alreadyExisted: boolean;
};

// A citation's source chunk, hydrated from Atlas by chunkId (no embedding).
export type KnowledgeChunkSource = {
  chunkId: string;
  documentId: string;
  documentName: string;
  chunkIndex: number;
  text: string;
};

export type ValidateKnowledgeFileResult =
  | { ok: true }
  | { ok: false; message: string };

export type KnowledgeUploadButtonProps = {
  // Conversation to attach the upload event to (the current tutor conversation).
  conversationId: string;
  // Called with the uploaded document after success (e.g. to show an event
  // message in the thread).
  onUploaded?: (document: KnowledgeDocumentResponse) => void;
};

// What the slot hook resolves from context so the composer stays unaware of the
// tutor-only gate and the post-upload thread event.
export type KnowledgeUploadSlotState = {
  // True only for tutor conversations, where the upload control is shown.
  show: boolean;
  // The tutor conversation the upload attaches to (null when none selected).
  conversationId: string | null;
  // Appends the optimistic "knowledge uploaded" event after a successful upload.
  onUploaded: (document: KnowledgeDocumentResponse) => void;
};
