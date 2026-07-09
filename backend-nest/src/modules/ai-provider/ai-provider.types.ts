export type ProviderRole = 'user' | 'assistant';

export interface ProviderMessage {
  role: ProviderRole;
  content: string;
}

export interface CompleteParams {
  system: string;
  messages: ProviderMessage[];
}

// ── Tool calling ────────────────────────────────────────────────────────────
export interface ProviderToolSpec {
  name: string;
  description: string;
  parameters: Record<string, unknown>;
}
export type ProviderInputItem =
  | { kind: 'message'; role: ProviderRole; content: string }
  | { kind: 'tool_call'; id: string; name: string; arguments: string }
  | { kind: 'tool_result'; id: string; result: string };

export interface StreamTurnParams {
  system: string;
  items: ProviderInputItem[];
  tools: ProviderToolSpec[];
}

export type ProviderTurnEvent =
  | { type: 'text-delta'; delta: string }
  | { type: 'tool-call'; id: string; name: string; arguments: string };
