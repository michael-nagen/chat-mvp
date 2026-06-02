import { useMessageComposer } from "./MessageComposer.use";
import { MessageComposerView } from "./MessageComposer.view";

/** Self-contained composer — manages draft, send, and rollback for the selected conversation. */
export function MessageComposer(): React.JSX.Element {
  const viewProps = useMessageComposer();
  return <MessageComposerView {...viewProps} />;
}
