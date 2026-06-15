import { useRef } from 'react';
import { useMessageSearch } from './MessageSearch.use';
import { MessageSearchContext } from './MessageSearch.context';
import { useClickOutside } from '../../shared/hooks/useClickOutside';
import { MessageSearchLayout } from './components/MessageSearch.layout';

type MessageSearchProps = {
  children: React.ReactNode;
};

/**
 * Search bar + swappable sidebar content. Focusing enters search mode and visually replaces
 * the conversation list (recents while typing, results after submit); clicking outside exits.
 */
export function MessageSearch({ children }: MessageSearchProps): React.JSX.Element {
  const search = useMessageSearch();
  const containerRef = useRef<HTMLDivElement>(null);

  useClickOutside({ ref: containerRef, onOutside: search.exit, enabled: search.state.isSearchMode });

  return (
    <MessageSearchContext.Provider value={search}>
      <MessageSearchLayout containerRef={containerRef}>{children}</MessageSearchLayout>
    </MessageSearchContext.Provider>
  );
}
