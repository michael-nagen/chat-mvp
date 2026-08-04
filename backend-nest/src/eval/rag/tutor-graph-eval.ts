import type { INestApplicationContext } from '@nestjs/common';
import { KnowledgeRetrievalService } from '../../modules/rag-tutor/retrieval/knowledge-retrieval.service';
import { TutorAnswerGenerator } from '../../modules/rag-tutor/generation/tutor-answer-generator';
import { RAG_TUTOR_MIN_SCORE_TOKEN } from '../../modules/rag-tutor/config/rag-tutor.constants';
import { buildTutorGraph } from '../../modules/agent/tutor/tutor-agent.graph';
import type {
  AnswerTutorQuestionInput,
  RagTutorAnswer,
} from '../../modules/rag-tutor/rag-tutor.types';

export type TutorAnswerFn = (
  input: AnswerTutorQuestionInput,
) => Promise<RagTutorAnswer>;

// Eval/debug-only adapter — NOT production code and NOT a second orchestrator.
// It invokes the one production tutor orchestration (the LangGraph that
// AgentService.streamTutorTurn drives) as a single non-streaming call, so
// offline eval/debug scripts can assert on the final answer + citations without
// the streaming/SSE machinery. No checkpointer: these runs are one-shot and
// stateless. The trusted userId travels via config.configurable, never graph
// state, exactly as in production.
export function makeEvalTutorAnswerFn(
  app: INestApplicationContext,
): TutorAnswerFn {
  const graph = buildTutorGraph({
    retrieval: app.get(KnowledgeRetrievalService, { strict: false }),
    generator: app.get(TutorAnswerGenerator, { strict: false }),
    minScore: app.get<number>(RAG_TUTOR_MIN_SCORE_TOKEN, { strict: false }),
  });

  return async ({ userId, question }) => {
    const finalState = await graph.invoke(
      { question },
      { configurable: { userId } },
    );
    return { answer: finalState.answer ?? '', citations: finalState.citations };
  };
}
