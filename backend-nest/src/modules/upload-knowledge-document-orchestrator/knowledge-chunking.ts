
const CHUNK_SIZE = 800;
const CHUNK_OVERLAP = 100;

const MARKDOWN_CONTENT_TYPE = 'text/markdown';
const HEADING_LINE = /^#{1,6}\s+/;

export function splitKnowledgeText({
  text,
  contentType,
}: {
  text: string;
  contentType: string;
}): string[] {
  const sections =
    contentType === MARKDOWN_CONTENT_TYPE
      ? splitMarkdownByHeadings(text)
      : splitTextByParagraphs(text);

  const chunks: string[] = [];
  for (const section of sections) {
    const trimmed = section.trim();
    if (trimmed.length === 0) {
      continue;
    }
    if (trimmed.length <= CHUNK_SIZE) {
      chunks.push(trimmed);
      continue;
    }
    for (const piece of splitBySize(trimmed, CHUNK_SIZE, CHUNK_OVERLAP)) {
      const trimmedPiece = piece.trim();
      if (trimmedPiece.length > 0) {
        chunks.push(trimmedPiece);
      }
    }
  }
  return chunks;
}

// Each section starts at a heading line and runs until the next heading; any
// preamble before the first heading becomes its own leading section.
function splitMarkdownByHeadings(text: string): string[] {
  const sections: string[] = [];
  let current: string[] = [];
  for (const line of text.split('\n')) {
    if (HEADING_LINE.test(line) && current.length > 0) {
      sections.push(current.join('\n'));
      current = [line];
    } else {
      current.push(line);
    }
  }
  if (current.length > 0) {
    sections.push(current.join('\n'));
  }
  return sections;
}

function splitTextByParagraphs(text: string): string[] {
  return text.split(/\n\s*\n/);
}

// Fixed-size sliding window. step = size - overlap keeps CHUNK_OVERLAP chars of
// context shared between neighbors.
function splitBySize(text: string, size: number, overlap: number): string[] {
  const step = size - overlap;
  const pieces: string[] = [];
  for (let start = 0; start < text.length; start += step) {
    pieces.push(text.slice(start, start + size));
    if (start + size >= text.length) {
      break;
    }
  }
  return pieces;
}
