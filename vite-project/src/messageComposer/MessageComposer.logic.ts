/** Returns true only when there is non-empty text and no send is in flight. */
export function canSend(value: string, isSending: boolean): boolean {
  return value.trim().length > 0 && !isSending;
}
