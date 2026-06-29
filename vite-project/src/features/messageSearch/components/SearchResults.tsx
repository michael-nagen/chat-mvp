import type { SearchResultsProps } from '../MessageSearch.types';
import { SearchResultRow } from './SearchResultRow';
import { messageSearchStyles } from './MessageSearch.styles';
import { useAuth } from '../../auth';
import { toMessage } from '../../../shared/entities/Message.mapper';

/** Scrollable list of message search hits, rendered in the regular message format. */
export function SearchResults({ results, onSelect }: SearchResultsProps): React.JSX.Element {
  const { user } = useAuth();
  const currentUserId = user?.id ?? null;

  return (
    <div style={messageSearchStyles.column}>
      {results.map((result) => (
        <SearchResultRow
          key={result.id}
          conversationTitle={result.conversationTitle}
          message={toMessage({ raw: result, currentUserId })}
          onSelect={() => onSelect(result)}
        />
      ))}
    </div>
  );
}
