import type { Ref } from 'react';
import { useMessageSearchContext } from '../MessageSearch.context';
import { SearchInput } from './SearchInput';
import { MessageSearchContent } from './MessageSearch.content';
import { messageSearchStyles } from './MessageSearch.styles';

type MessageSearchLayoutProps = {
  containerRef: Ref<HTMLDivElement>;
  /** The regular conversation list — kept mounted and hidden while searching, never reloaded. */
  children: React.ReactNode;
};

export function MessageSearchLayout({
  containerRef,
  children,
}: MessageSearchLayoutProps): React.JSX.Element {
  const { state } = useMessageSearchContext();
  return (
    <div ref={containerRef} style={messageSearchStyles.container}>
      <div style={messageSearchStyles.inputBar}>
        <SearchInput />
      </div>
      <div style={messageSearchStyles.scroll}>
        <div style={state.isSearchMode ? messageSearchStyles.hidden : messageSearchStyles.visible}>
          {children}
        </div>
        {state.isSearchMode && <MessageSearchContent />}
      </div>
    </div>
  );
}
