import {
  END,
  START,
  StateGraph,
  type BaseCheckpointSaver,
} from '@langchain/langgraph';
import { TutorAgentStateAnnotation } from './tutor-agent.state';
import { buildTutorNodes, type TutorNodeDeps } from './tutor-agent.nodes';

// Tutor path: retrieve grounding chunks, then answer from them (or fall back).
// Node names carry a "_node" suffix because LangGraph forbids a node name from
// colliding with a state channel (e.g. the `answer` channel).
export function buildTutorGraph(
  deps: TutorNodeDeps & { checkpointer?: BaseCheckpointSaver },
) {
  const { retrieve, answer } = buildTutorNodes(deps);
  return new StateGraph(TutorAgentStateAnnotation)
    .addNode('retrieve_node', retrieve)
    .addNode('answer_node', answer)
    .addEdge(START, 'retrieve_node')
    .addEdge('retrieve_node', 'answer_node')
    .addEdge('answer_node', END)
    .compile({ checkpointer: deps.checkpointer });
}
