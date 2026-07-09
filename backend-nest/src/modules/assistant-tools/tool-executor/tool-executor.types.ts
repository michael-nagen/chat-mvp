export type ToolErrorCode =
  | 'UNKNOWN_TOOL'
  | 'INVALID_TOOL_INPUT'
  | 'INVALID_TOOL_OUTPUT'
  | 'TOOL_EXECUTION_FAILED';

export interface ToolError {
  code: ToolErrorCode;
  message: string;
}

export type ToolResult =
  | { ok: true; output: unknown }
  | { ok: false; error: ToolError };
