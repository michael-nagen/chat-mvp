import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { uploadKnowledgeDocument } from '../model/KnowledgeUpload.api';
import { setTokenProvider } from '../../../shared/api/apiClient';

const okResponse = () => ({
  ok: true,
  json: async () => ({
    document: { id: 'kd-1', fileName: 'notes.md', status: 'ready', chunkCount: 1, createdAt: 'x' },
    alreadyExisted: false,
  }),
});

const fetchMock = vi.fn();

describe('uploadKnowledgeDocument', () => {
  beforeEach(() => {
    fetchMock.mockReset();
    fetchMock.mockResolvedValue(okResponse());
    vi.stubGlobal('fetch', fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    setTokenProvider(() => null);
  });

  it('POSTs multipart FormData with the exact "file" field + conversationId, without a manual Content-Type', async () => {
    setTokenProvider(() => 'jwt-123');
    const file = new File(['hello'], 'notes.md', { type: 'text/markdown' });

    await uploadKnowledgeDocument({ file, conversationId: 'c1' });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(String(url)).toMatch(/\/knowledge\/documents$/);
    expect(init.method).toBe('POST');

    const body = init.body as FormData;
    expect(body).toBeInstanceOf(FormData);
    const uploaded = body.get('file') as File;
    expect(uploaded.name).toBe('notes.md');
    expect(body.get('conversationId')).toBe('c1');

    // Browser must set the multipart boundary — we must not set Content-Type.
    const headers = (init.headers ?? {}) as Record<string, string>;
    expect(Object.keys(headers).map((h) => h.toLowerCase())).not.toContain('content-type');
    expect(headers.Authorization).toBe('Bearer jwt-123');
  });

  it('omits conversationId when none is given', async () => {
    const file = new File(['hello'], 'notes.md', { type: 'text/markdown' });

    await uploadKnowledgeDocument({ file });

    const body = fetchMock.mock.calls[0][1].body as FormData;
    expect((body.get('file') as File).name).toBe('notes.md');
    expect(body.get('conversationId')).toBeNull();
  });

  it('surfaces a clear error when the backend rejects the upload', async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      status: 400,
      json: async () => ({ error: { message: 'Only .txt and .md files are supported.' } }),
    });
    const file = new File(['x'], 'notes.pdf', { type: 'application/pdf' });

    await expect(uploadKnowledgeDocument({ file })).rejects.toThrow(
      'Only .txt and .md files are supported.',
    );
  });
});
