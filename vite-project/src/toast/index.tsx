import { useCallback } from "react";
import { useChatContext } from "../chatPage/ChatContext";
import { useAutoDismiss } from "./Toast.use";
import { ToastView } from "./Toast.view";

/** Self-contained toast — reads sendError from ChatContext and auto-dismisses after 3 s. */
export function Toast(): React.JSX.Element | null {
  const { sendError, setSendError } = useChatContext();
  const dismiss = useCallback((): void => setSendError(null), [setSendError]);
  useAutoDismiss(sendError !== null, dismiss);
  if (sendError === null) return null;
  return <ToastView message={sendError} onDismiss={dismiss} />;
}
