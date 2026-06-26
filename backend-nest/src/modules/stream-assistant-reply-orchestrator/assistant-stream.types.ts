
export interface TokenEventData {
  delta: string;
}

export interface DoneEventData {
  messageId: string;
}

export interface ErrorEventData {
  code: string;
  message: string;
}
