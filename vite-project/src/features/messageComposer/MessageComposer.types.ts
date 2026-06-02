/** Props consumed by MessageComposerView — also the shape returned by useMessageComposer. */
export type MessageComposerViewProps = {
  value: string;
  onChange: (value: string) => void;
  isSending: boolean;
  sendable: boolean;
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  handleKeyDown: (event: React.KeyboardEvent<HTMLTextAreaElement>) => void;
};

/** Props for the draft textarea. */
export type MessageComposerTextareaProps = {
  value: string;
  onChange: (value: string) => void;
  onKeyDown: (event: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  isSending: boolean;
};

/** Props for the send button. */
export type MessageComposerSendButtonProps = {
  sendable: boolean;
  isSending: boolean;
};
