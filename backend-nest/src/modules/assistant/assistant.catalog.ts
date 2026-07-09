import { AssistantDefinition, AssistantId } from './assistant.types';
import { ASSISTANT_SYSTEM_PROMPT } from '../../prompts/assistant-system.prompt';
import { TUTOR_SYSTEM_PROMPT } from '../../prompts/tutor-system.prompt';

// The default assistant used when a conversation specifies none, and the
// fallback for unknown/legacy ids.
export const DEFAULT_ASSISTANT_ID: AssistantId = 'general-assistant';

// The built-in assistant identity for tutor conversations. Its retrieval
// behavior arrives in Part 6; for now it only provides a participant identity.
export const TUTOR_ASSISTANT_ID: AssistantId = 'tutor-assistant';

// The built-in assistant catalog. Adding an assistant means a new entry here
// plus its prompt in prompts/ — no orchestration or controller changes.
export const ASSISTANT_DEFINITIONS: Record<AssistantId, AssistantDefinition> = {
  'general-assistant': {
    id: 'general-assistant',
    displayName: 'Assistant',
    systemPrompt: ASSISTANT_SYSTEM_PROMPT,
  },
  'tutor-assistant': {
    id: 'tutor-assistant',
    displayName: 'RAG Tutor',
    systemPrompt: TUTOR_SYSTEM_PROMPT,
  },
};
