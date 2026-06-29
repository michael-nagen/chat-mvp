import type { SearchEmptyProps } from '../MessageSearch.types';
import { messageSearchStyles } from './MessageSearch.styles';

/** Shown when a search returns no messages. */
export function SearchEmpty({ query }: SearchEmptyProps): React.JSX.Element {
  return <div style={messageSearchStyles.center}>No messages found for “{query}”</div>;
}
