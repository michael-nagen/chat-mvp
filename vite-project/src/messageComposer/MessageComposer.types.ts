/** Props for the message composer, carrying controlled input state and send callback. */
export type MessageComposerProps = {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  isSending: boolean;
};
