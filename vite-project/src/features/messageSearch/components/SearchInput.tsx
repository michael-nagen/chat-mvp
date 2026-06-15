import { useMessageSearchContext } from '../MessageSearch.context';
import { messageSearchStyles } from './MessageSearch.styles';

/** Controlled search field; submits the query on Enter, never per keystroke. */
export function SearchInput(): React.JSX.Element {
  const { state, setQuery, focus, submit } = useMessageSearchContext();
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
    >
      <input
        type="text"
        value={state.query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={focus}
        placeholder="Search messages"
        style={messageSearchStyles.input}
      />
    </form>
  );
}
