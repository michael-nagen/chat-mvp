// Human-readable progress labels shown while a tool runs during the assistant
// loop. Keyed by tool name; unknown tools fall back to a neutral label so a new
// tool never leaks its internal name into the UI.
const TOOL_PROGRESS_LABELS: Record<string, string> = {
  retrieve_knowledge: 'Searching your documents…',
  list_my_conversations: 'Looking up your conversations…',
};

const DEFAULT_TOOL_PROGRESS_LABEL = 'Working on it…';

export function toolProgressLabel(toolName: string): string {
  return TOOL_PROGRESS_LABELS[toolName] ?? DEFAULT_TOOL_PROGRESS_LABEL;
}
