import type { SearchErrorProps } from '../MessageSearch.types';
import { messageSearchStyles } from './MessageSearch.styles';

/** Inline error shown when a search request fails. */
export function SearchError({ error }: SearchErrorProps): React.JSX.Element {
  return <div style={messageSearchStyles.error}>{error}</div>;
}
