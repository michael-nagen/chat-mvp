import { Injectable } from '@nestjs/common';
import { ToolRegistry } from '../tool-registry/tool-registry';
import { ToolResult } from './tool-executor.types';

@Injectable()
export class ToolExecutor {
  constructor(private readonly registry: ToolRegistry) {}

  async execute({
    name,
    rawInput,
    userId,
  }: {
    name: string;
    rawInput: unknown;
    userId: string;
  }): Promise<ToolResult> {
    const tool = this.registry.get({ name });
    if (!tool) {
      return {
        ok: false,
        error: { code: 'UNKNOWN_TOOL', message: `Unknown tool: ${name}` },
      };
    }

    const parsedInput = tool.inputSchema.safeParse(rawInput);
    if (!parsedInput.success) {
      return {
        ok: false,
        error: {
          code: 'INVALID_TOOL_INPUT',
          message: `Invalid input for tool ${name}.`,
        },
      };
    }

    let output: unknown;
    try {
      output = await tool.execute({
        input: parsedInput.data,
        context: { userId },
      });
    } catch {
      return {
        ok: false,
        error: {
          code: 'TOOL_EXECUTION_FAILED',
          message: `Tool ${name} failed to execute.`,
        },
      };
    }

    const parsedOutput = tool.outputSchema.safeParse(output);
    if (!parsedOutput.success) {
      return {
        ok: false,
        error: {
          code: 'INVALID_TOOL_OUTPUT',
          message: `Tool ${name} produced an invalid result.`,
        },
      };
    }

    return { ok: true, output: parsedOutput.data };
  }
}
