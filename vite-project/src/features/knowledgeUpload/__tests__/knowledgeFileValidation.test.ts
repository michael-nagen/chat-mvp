import { describe, expect, it } from 'vitest';
import {
  MAX_KNOWLEDGE_FILE_SIZE_BYTES,
  validateKnowledgeFile,
} from '../model/knowledgeFileValidation';

const file = (
  name: string,
  { type = '', size = 10 }: { type?: string; size?: number } = {},
): File => {
  const blob = new File([new Uint8Array(size)], name, { type });
  return blob;
};

describe('validateKnowledgeFile', () => {
  it('accepts a .txt file', () => {
    expect(validateKnowledgeFile(file('notes.txt', { type: 'text/plain' }))).toEqual({
      ok: true,
    });
  });

  it('accepts a .md file even when the browser gives no MIME type', () => {
    expect(validateKnowledgeFile(file('readme.md', { type: '' }))).toEqual({
      ok: true,
    });
  });

  it('accepts by MIME type when the extension is unusual', () => {
    expect(
      validateKnowledgeFile(file('notes', { type: 'text/markdown' })),
    ).toEqual({ ok: true });
  });

  it('rejects a .pdf with the PDF-specific message', () => {
    const result = validateKnowledgeFile(
      file('doc.pdf', { type: 'application/pdf' }),
    );
    expect(result.ok).toBe(false);
    expect(result).toEqual({
      ok: false,
      message: 'PDF upload is not supported yet. Please upload a .txt or .md file.',
    });
  });

  it('rejects an unknown file type', () => {
    const result = validateKnowledgeFile(
      file('run.exe', { type: 'application/octet-stream' }),
    );
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.message).toContain('Unsupported file type');
    }
  });

  it('rejects a file above the size limit', () => {
    const result = validateKnowledgeFile(
      file('big.txt', { type: 'text/plain', size: MAX_KNOWLEDGE_FILE_SIZE_BYTES + 1 }),
    );
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.message).toContain('too large');
    }
  });
});
