import { useMessageComposer } from "./MessageComposer.use";
import { MessageComposerView } from "./MessageComposer.view";

/** Self-contained composer — manages draft, send, and rollback via ChatContext. */
export function MessageComposer(): React.JSX.Element {
  const viewProps = useMessageComposer();
  return <MessageComposerView {...viewProps} />;
}
