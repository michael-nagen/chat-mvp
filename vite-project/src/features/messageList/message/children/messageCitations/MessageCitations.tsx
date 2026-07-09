import { messageStyles } from '../../Message.styles';
import { useMessage } from '../../Message.context';
import { useMessageCitations } from './MessageCitations.use';
import { MessageCitationsContext } from './MessageCitations.context';
import { CitationItem } from './children/CitationItem';

// "Sources" block under a tutor answer. Self-guards to nothing for the user's own
// messages or when there are no citations, then lists each citation as a
// CitationItem. Source hydration lives in useMessageCitations and is shared with
// the rows through context; citations are references only — never embeddings and
// never the full chunk.
export function MessageCitations(): React.JSX.Element | null {
  const { message } = useMessage();
  const { citations, ...source } = useMessageCitations();

  if (message.sender === 'user' || citations.length === 0) {
    return null;
  }

  return (
    <MessageCitationsContext.Provider value={source}>
      <section style={messageStyles.citations}>
        <span style={messageStyles.citationsTitle}>Sources</span>
        {citations.map((citation, index) => (
          <CitationItem key={citation.chunkId} citation={citation} index={index} />
        ))}
      </section>
    </MessageCitationsContext.Provider>
  );
}
