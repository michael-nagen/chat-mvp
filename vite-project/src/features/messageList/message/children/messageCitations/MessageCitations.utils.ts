export const SOURCE_PREVIEW_MAX_CHARS = 260;

// Compact preview for an on-demand source chunk: trims surrounding whitespace and
// caps the length with an ellipsis, so an expanded source stays compact and never
// dumps the full chunk into the thread. Pure and side-effect free.
export function createSourcePreview(text: string): string {
  const trimmed = text.trim();
  if (trimmed.length <= SOURCE_PREVIEW_MAX_CHARS) return trimmed;
  return `${trimmed.slice(0, SOURCE_PREVIEW_MAX_CHARS).trimEnd()}…`;
}
