import type { MessageSearchController } from '../MessageSearch.use';
import { messageSearchStyles } from './MessageSearch.styles';

type SearchInputProps = {
  controller: MessageSearchController;
};

/** Controlled search field; submits the query on Enter, never per keystroke. */
export function SearchInput({ controller }: SearchInputProps): React.JSX.Element {
  const { state, setQuery, focus, submit } = controller;
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
