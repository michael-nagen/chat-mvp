// Matches the cap the pre-LangGraph orchestrator enforced: up to 5 LLM turns;
// tools requested on the 5th turn still run, then the loop reports the limit.
export const MAX_TOOL_ITERATIONS = 5;

export const ASSISTANT_GENERATION_FAILED_CODE = 'ASSISTANT_GENERATION_FAILED';
export const ASSISTANT_TOOL_LIMIT_CODE = 'ASSISTANT_TOOL_LIMIT';
