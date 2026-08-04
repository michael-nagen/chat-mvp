import {
  END,
  START,
  StateGraph,
  type BaseCheckpointSaver,
} from '@langchain/langgraph';
import { AssistantAgentStateAnnotation } from './assistant-agent.state';
import {
  afterAgentTurn,
  afterRunTools,
  buildAssistantNodes,
  type AssistantNodeDeps,
} from './assistant-agent.nodes';

// Reproduces the pre-LangGraph assistant loop:
//   agent_turn streams tokens and either finalizes (no tool calls) or hands its
//   tool calls to run_tools, which executes them and loops back until an answer
//   or the turn cap. Nodes stream token/final/error via the custom writer.
export function buildAssistantGraph(
  deps: AssistantNodeDeps & { checkpointer?: BaseCheckpointSaver },
) {
  const { agentTurn, runTools } = buildAssistantNodes(deps);
  return new StateGraph(AssistantAgentStateAnnotation)
    .addNode('agent_turn', agentTurn)
    .addNode('run_tools', runTools)
    .addEdge(START, 'agent_turn')
    .addConditionalEdges('agent_turn', afterAgentTurn, ['run_tools', END])
    .addConditionalEdges('run_tools', afterRunTools, ['agent_turn', END])
    .compile({ checkpointer: deps.checkpointer });
}
