import type { MessageSearchController } from '../MessageSearch.use';
import { selectSearchContent } from './MessageSearch.content';

type MessageSearchViewProps = {
  controller: MessageSearchController;
};

export function MessageSearchView({ controller }: MessageSearchViewProps): React.JSX.Element {
  return selectSearchContent(controller);
}
