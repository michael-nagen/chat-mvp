import { Injectable } from '@nestjs/common';
import {
  AssistantDefinition,
  AssistantId,
  AssistantSummary,
} from './assistant.types';
import {
  ASSISTANT_DEFINITIONS,
  DEFAULT_ASSISTANT_ID,
} from './assistant.catalog';

// Catalog of built-in assistants. Resolves an assistant participant id to its
// full definition.
@Injectable()
export class AssistantRegistry {
  // Unknown or missing ids (e.g. a legacy conversation, or an id no longer in
  // the catalog) fall back to the default assistant rather than throwing
  // mid-request.
  resolve({ assistantId }: { assistantId?: string }): AssistantDefinition {
    const definition =
      assistantId !== undefined
        ? ASSISTANT_DEFINITIONS[assistantId as AssistantId]
        : undefined;
    return definition ?? ASSISTANT_DEFINITIONS[DEFAULT_ASSISTANT_ID];
  }

  // Whether a participant id belongs to a built-in assistant. The registry is
  // the single source of truth for assistant identity, so domain code asks this
  // instead of parsing the id.
  isAssistant({ participantId }: { participantId: string }): boolean {
    return Object.prototype.hasOwnProperty.call(
      ASSISTANT_DEFINITIONS,
      participantId,
    );
  }

summarize({ assistantId }: { assistantId?: string }): AssistantSummary {
    const definition = this.resolve({ assistantId });
    return {
      id: definition.id,
      displayName: definition.displayName,
      avatarUrl: null,
    };
  }
}
