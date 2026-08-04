import type { LangGraphRunnableConfig } from '@langchain/langgraph';
import type { KnowledgeRetrievalService } from '../../rag-tutor/retrieval/knowledge-retrieval.service';
import type { TutorAnswerGenerator } from '../../rag-tutor/generation/tutor-answer-generator';
import { RAG_TUTOR_TOP_K } from '../../rag-tutor/config/rag-tutor.constants';
import {
  formatKnowledgeContext,
  RAG_TUTOR_FALLBACK_ANSWER,
} from '../../rag-tutor/prompts/rag-tutor.prompt';
import {
  selectStrongChunks,
  toRagTutorCitation,
} from '../../rag-tutor/rag-tutor.grounding';
import type { TutorAgentState } from './tutor-agent.state';

export interface TutorNodeDeps {
  retrieval: KnowledgeRetrievalService;
  generator: TutorAnswerGenerator;
  minScore: number;
}

type NodeUpdate = Partial<TutorAgentState>;

// Retrieval scoped to the trusted userId from config, then the same defensive
// threshold the RAG tutor service applies (retrieval may not enforce minScore).
function makeRetrieveNode({ retrieval, minScore }: TutorNodeDeps) {
  return async function retrieve(
    state: TutorAgentState,
    config: LangGraphRunnableConfig,
  ): Promise<NodeUpdate> {
    const userId = readUserId(config);
    const retrieved = await retrieval.retrieve({
      userId,
      question: state.question,
      topK: RAG_TUTOR_TOP_K,
      minScore,
    });
    return { strongChunks: selectStrongChunks(retrieved, minScore) };
  };
}

// No strong context → the safe fallback with no citations, so the generator is
// never called. Otherwise generate from the cited context and return the
// reference-only citations.
function makeAnswerNode({ generator }: TutorNodeDeps) {
  return async function answer(state: TutorAgentState): Promise<NodeUpdate> {
    if (state.strongChunks.length === 0) {
      return { answer: RAG_TUTOR_FALLBACK_ANSWER, citations: [] };
    }
    const generated = await generator.generate({
      question: state.question,
      context: formatKnowledgeContext(state.strongChunks),
    });
    return {
      answer: generated,
      citations: state.strongChunks.map(toRagTutorCitation),
    };
  };
}

function readUserId(config: LangGraphRunnableConfig): string {
  const userId = config.configurable?.userId as string | undefined;
  if (userId === undefined) {
    throw new Error('Tutor agent invoked without a trusted userId.');
  }
  return userId;
}

export function buildTutorNodes(deps: TutorNodeDeps) {
  return {
    retrieve: makeRetrieveNode(deps),
    answer: makeAnswerNode(deps),
  };
}
