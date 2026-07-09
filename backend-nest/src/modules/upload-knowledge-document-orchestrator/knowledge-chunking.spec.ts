import { splitKnowledgeText } from './knowledge-chunking';

const md = (text: string) => splitKnowledgeText({ text, contentType: 'text/markdown' });
const txt = (text: string) => splitKnowledgeText({ text, contentType: 'text/plain' });

describe('splitKnowledgeText', () => {
  describe('markdown', () => {
    it('splits by headings and preserves the heading in each chunk', () => {
      const chunks = md(
        '# Intro\nWelcome.\n\n## Setup\nInstall it.\n\n## Usage\nRun it.',
      );

      expect(chunks).toHaveLength(3);
      expect(chunks[0]).toBe('# Intro\nWelcome.');
      expect(chunks[1]).toBe('## Setup\nInstall it.');
      expect(chunks[2]).toBe('## Usage\nRun it.');
      // Every heading text is retained inside its chunk.
      expect(chunks.every((c) => c.includes('#'))).toBe(true);
    });

    it('keeps preamble before the first heading as its own leading chunk', () => {
      const chunks = md('Loose intro line.\n\n# Title\nBody.');

      expect(chunks[0]).toBe('Loose intro line.');
      expect(chunks[1]).toBe('# Title\nBody.');
    });
  });

  describe('plain text', () => {
    it('splits by blank-line paragraphs', () => {
      const chunks = txt('First paragraph.\n\nSecond paragraph.\n\nThird.');

      expect(chunks).toEqual([
        'First paragraph.',
        'Second paragraph.',
        'Third.',
      ]);
    });

    it('drops empty paragraphs and trims', () => {
      const chunks = txt('  Alpha  \n\n\n\n   \n\n  Beta ');

      expect(chunks).toEqual(['Alpha', 'Beta']);
    });
  });

  describe('size fallback (800/100)', () => {
    it('splits an oversized section into overlapping 800-char windows', () => {
      const big = 'a'.repeat(2000);
      const chunks = txt(big);

      // Windows at 0, 700, 1400 → 3 pieces; first two are full 800-char windows.
      expect(chunks).toHaveLength(3);
      expect(chunks[0].length).toBe(800);
      expect(chunks[1].length).toBe(800);
      expect(chunks[2].length).toBe(2000 - 1400);
    });

    it('does not split a section at or under 800 chars', () => {
      const chunks = txt('b'.repeat(800));
      expect(chunks).toHaveLength(1);
      expect(chunks[0].length).toBe(800);
    });

    it('preserves order across sections and fallback pieces', () => {
      const chunks = txt(`short one\n\n${'x'.repeat(1500)}\n\nshort two`);

      expect(chunks[0]).toBe('short one');
      expect(chunks[chunks.length - 1]).toBe('short two');
      // The middle oversized paragraph contributes its windows in between.
      expect(chunks.length).toBeGreaterThan(3);
    });
  });

  it('returns no chunks for whitespace-only input', () => {
    expect(txt('   \n\n  \t ')).toEqual([]);
  });
});
