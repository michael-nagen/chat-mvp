import { messageStyles } from '../../../Message.styles';
import { useCitationSource } from '../MessageCitations.context';
import type { CitationItemProps } from '../MessageCitations.types';

// One "Sources" row: label, a Show/Hide source toggle, and a compact preview.
// Presentational — its open/loading/preview state comes from the shared citation
// source context, keyed by this citation's chunkId.
export function CitationItem({
  citation,
  index,
}: CitationItemProps): React.JSX.Element {
  const { isSourceOpen, isSourceLoading, getSourcePreview, toggleSource } =
    useCitationSource();
  const preview = getSourcePreview(citation.chunkId);

  return (
    <div style={messageStyles.citationItem}>
      <span>
        {index + 1}. {citation.documentName || citation.documentId} · chunk{' '}
        {citation.chunkIndex} · score {citation.score.toFixed(2)}
      </span>
      <button
        type="button"
        style={messageStyles.citationShowSource}
        disabled={isSourceLoading(citation.chunkId)}
        onClick={() => toggleSource(citation.chunkId)}
      >
        {isSourceLoading(citation.chunkId)
          ? 'Loading…'
          : isSourceOpen(citation.chunkId)
            ? 'Hide source'
            : 'Show source'}
      </button>
      {preview !== null ? (
        <div style={messageStyles.citationSourceText}>{preview}</div>
      ) : null}
    </div>
  );
}
