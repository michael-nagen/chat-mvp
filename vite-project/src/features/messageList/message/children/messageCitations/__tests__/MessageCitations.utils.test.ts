import { describe, it, expect } from 'vitest';
import {
  SOURCE_PREVIEW_MAX_CHARS,
  createSourcePreview,
} from '../MessageCitations.utils';

describe('createSourcePreview', () => {
  it('trims surrounding whitespace and returns short text unchanged', () => {
    expect(createSourcePreview('  hello world  ')).toBe('hello world');
  });

  it('returns text at the limit without an ellipsis', () => {
    const text = 'a'.repeat(SOURCE_PREVIEW_MAX_CHARS);
    expect(createSourcePreview(text)).toBe(text);
  });

  it('truncates longer text to the cap with an ellipsis', () => {
    const text = 'a'.repeat(SOURCE_PREVIEW_MAX_CHARS + 50);
    const preview = createSourcePreview(text);
    expect(preview.endsWith('…')).toBe(true);
    expect(preview).toHaveLength(SOURCE_PREVIEW_MAX_CHARS + 1);
  });
});
