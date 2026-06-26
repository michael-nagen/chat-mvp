import { z } from 'zod';
import { AssistantTool } from '../assistant-tools/tool-registry/assistant-tool';
import { ProviderToolSpec } from '../ai-provider/ai-provider.types';

export const toProviderToolSpec = (tool: AssistantTool): ProviderToolSpec => {
  const parameters = z.toJSONSchema(tool.inputSchema) as Record<string, unknown>;
  delete parameters['$schema'];
  return {
    name: tool.name,
    description: tool.description,
    parameters,
  };
};
