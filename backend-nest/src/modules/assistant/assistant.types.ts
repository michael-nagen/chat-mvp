export type AssistantId = 'general-assistant';

export interface AssistantDefinition {
  id: AssistantId;
  displayName: string;
  systemPrompt: string;
}

export interface AssistantSummary {
  id: string;
  displayName: string;
  avatarUrl: null;
}
 