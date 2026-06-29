import type { SearchResultRowProps } from '../MessageSearch.types';
import { messageSearchStyles } from './MessageSearch.styles';
import { Message } from '../../messageList/message';

/** A single search hit: conversation title above the regular message bubble. */
export function SearchResultRow({
  conversationTitle,
  message,
  onSelect,
}: SearchResultRowProps): React.JSX.Element {
  return (
    <div onClick={onSelect} style={messageSearchStyles.resultRow}>
      <div style={messageSearchStyles.resultTitle}>{conversationTitle}</div>
      <div style={messageSearchStyles.resultBody}>
        <Message message={message} />
      </div>
    </div>
  );
}
