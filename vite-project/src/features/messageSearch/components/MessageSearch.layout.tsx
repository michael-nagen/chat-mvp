import type { Ref } from 'react';
import type { MessageSearchController } from '../MessageSearch.use';
import { SearchInput } from './SearchInput';
import { MessageSearchView } from './MessageSearch.view';
import { messageSearchStyles } from './MessageSearch.styles';

type MessageSearchLayoutProps = {
  controller: MessageSearchController;
  containerRef: Ref<HTMLDivElement>;
  /** The regular conversation list — kept mounted and hidden while searching, never reloaded. */
  children: React.ReactNode;
};

export function MessageSearchLayout({
  controller,
  containerRef,
  children,
}: MessageSearchLayoutProps): React.JSX.Element {
  const { state } = controller;
  return (
    <div ref={containerRef} style={messageSearchStyles.container}>
      <div style={messageSearchStyles.inputBar}>
        <SearchInput controller={controller} />
      </div>
      <div style={messageSearchStyles.scroll}>
        <div style={state.isSearchMode ? messageSearchStyles.hidden : messageSearchStyles.visible}>
          {children}
        </div>
        {state.isSearchMode && <MessageSearchView controller={controller} />}
      </div>
    </div>
  );
}
