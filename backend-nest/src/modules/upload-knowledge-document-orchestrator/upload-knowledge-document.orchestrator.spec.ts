import { UploadKnowledgeDocumentOrchestrator } from './upload-knowledge-document.orchestrator';
import { TUTOR_ASSISTANT_ID } from '../assistant/assistant.catalog';
import type { KnowledgeDocument } from '../../common/storage/entities';
import type { UploadedFileLike } from '../knowledge-documents/knowledge-document.types';

const DOC: KnowledgeDocument = {
  id: 'kd-1',
  userId: 'u1',
  fileName: 'notes.md',
  contentType: 'text/markdown',
  contentHash: 'hash-1',
  status: 'ready',
  chunkCount: 1,
  createdAt: '2026-07-03T00:00:00.000Z',
};

const file = (): UploadedFileLike => {
  const buffer = Buffer.from('RAG grounds answers in your own documents.');
  return { originalname: 'notes.md', buffer, size: buffer.length, mimetype: 'text/markdown' };
};

// Collaborators faked at the boundary the orchestrator actually calls; the
// ingest transaction just runs its callback with a dummy tx.
const makeDeps = (conversation: unknown) => {
  const documents = {
    findByUserAndHash: jest.fn(async () => undefined),
    create: jest.fn(async () => DOC),
    updateChunkCount: jest.fn(async () => DOC),
  };
  const chunks = { createForDocument: jest.fn(async () => [{}]) };
  const embeddings = { embedDocuments: jest.fn(async (texts: string[]) => texts.map(() => [0.1])) };
  const messages = {
    create: jest.fn(async (input: Record<string, unknown>) => ({
      ...input,
      id: 'm1',
      createdAt: '2026-07-03T00:00:01.000Z',
    })),
  };
  const conversations = {
    getById: jest.fn(async () => conversation),
    updateLastMessage: jest.fn(async () => undefined),
  };
  const unitOfWork = { run: jest.fn(async (cb: (tx: unknown) => unknown) => cb({})) };

  const orchestrator = new UploadKnowledgeDocumentOrchestrator(
    documents as never,
    chunks as never,
    embeddings as never,
    messages as never,
    conversations as never,
    unitOfWork as never,
  );
  return { orchestrator, messages, conversations };
};

describe('UploadKnowledgeDocumentOrchestrator upload event', () => {
  it('posts a visible upload event into a tutor conversation after ingest', async () => {
    const { orchestrator, messages, conversations } = makeDeps({
      id: 'c1',
      type: 'tutor',
      participantIds: ['u1'],
    });

    const result = await orchestrator.execute({
      userId: 'u1',
      file: file(),
      conversationId: 'c1',
    });

    expect(result.document.fileName).toBe('notes.md');
    expect(messages.create).toHaveBeenCalledTimes(1);
    expect(messages.create).toHaveBeenCalledWith(
      expect.objectContaining({
        conversationId: 'c1',
        userId: TUTOR_ASSISTANT_ID,
        content: 'Uploaded knowledge file: notes.md',
        metadata: expect.objectContaining({
          kind: 'knowledge_upload',
          documentId: 'kd-1',
          documentName: 'notes.md',
          status: 'completed',
        }),
      }),
    );
    expect(conversations.updateLastMessage).toHaveBeenCalledTimes(1);
  });

  it('does not post an event for a non-tutor conversation', async () => {
    const { orchestrator, messages } = makeDeps({
      id: 'c1',
      type: 'dm',
      participantIds: ['u1'],
    });

    await orchestrator.execute({ userId: 'u1', file: file(), conversationId: 'c1' });

    expect(messages.create).not.toHaveBeenCalled();
  });

  it('does not post an event when no conversationId is provided', async () => {
    const { orchestrator, messages, conversations } = makeDeps({
      id: 'c1',
      type: 'tutor',
      participantIds: ['u1'],
    });

    await orchestrator.execute({ userId: 'u1', file: file() });

    expect(conversations.getById).not.toHaveBeenCalled();
    expect(messages.create).not.toHaveBeenCalled();
  });
});
