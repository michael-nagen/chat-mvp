import { useRef } from 'react';
import { useMessageSearch } from './MessageSearch.use';
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
  const controller = useMessageSearch();
  const containerRef = useRef<HTMLDivElement>(null);

  useClickOutside({ ref: containerRef, onOutside: controller.exit, enabled: controller.state.isSearchMode });

  return (
    <MessageSearchLayout controller={controller} containerRef={containerRef}>
      {children}
    </MessageSearchLayout>
  );
}
