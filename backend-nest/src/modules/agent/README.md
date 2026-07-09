# Agent module

`AgentService` runs the two AI conversation modes of the app as **LangGraph
state graphs**: the tool-using **assistant** and the retrieval-grounded
**tutor**. It replaces the hand-rolled loop that used to live inside the
stream-assistant-reply orchestrator, without changing the outward SSE contract.

The service owns the compiled graphs and exposes two async generators of
*internal* events. Persistence and the SSE mapping stay in the orchestrator — the
graphs only decide what to say and emit progress/token/final/error events.

```
StreamAssistantReplyOrchestrator
        │  (conversation.type)
        ├── assistant ─► AgentService.streamAssistantTurn ─► assistant graph
        └── tutor     ─► AgentService.streamTutorTurn     ─► tutor graph
```

## Layout

| Path | Role |
| --- | --- |
| `agent.service.ts` | Compiles both graphs once, exposes `streamAssistantTurn` / `streamTutorTurn`. |
| `agent.module.ts` | Wires the graphs onto the existing provider, assistant registry, tool executor and RAG services. |
| `assistant/` | Assistant tool-loop graph: `*.graph.ts`, `*.nodes.ts`, `*.state.ts`, `*.types.ts`, `*.constants.ts`, plus the tool-arg parser, tool-spec mapper and progress labels. |
| `tutor/` | Tutor retrieve→answer graph: graph/nodes/state/types plus stream constants and the token-splitter util. |
| `checkpoint/` | `GraphCheckpointer` — the single LangGraph checkpointer for the process. |

The `retrieve_knowledge` tool the assistant graph can call lives with the other
tools under `assistant-tools/retrieve-knowledge/`.

## Assistant graph

Reproduces the previous assistant loop as two nodes:

- **`agent_turn`** — streams one LLM turn. Text deltas are emitted as `token`
  events through the custom stream writer; tool calls are collected. A turn with
  no tool calls is the final answer (`final`); a provider failure ends the loop
  with a generation `error`.
- **`run_tools`** — executes the pending tool calls through the existing
  `ToolExecutor`, appends each call + result to the running item list, then loops
  back to `agent_turn` until an answer or the turn cap (`MAX_TOOL_ITERATIONS = 5`,
  matching the old orchestrator) is reached.

```
START ─► agent_turn ─(tool calls)─► run_tools ─(under cap)─► agent_turn
             │                            │
          (no calls / fail) ─► END     (cap reached) ─► END
```

## Tutor graph

Two nodes, linear:

- **`retrieve_node`** — retrieves chunks scoped to the trusted user, then applies
  the same defensive `minScore` threshold the RAG tutor service uses.
- **`answer_node`** — with no strong chunks, returns the safe fallback answer and
  **no** citations (the generator is never called). Otherwise it generates from
  the cited context and returns reference-only citations.

`streamTutorTurn` invokes the graph, emits a `searching`/`generating` progress
label, replays the finished answer as word-sized `token` deltas for progressive
rendering, and ends with a `final` carrying the citations the orchestrator
persists.

## Security: `userId` never lives in graph state

The **trusted `userId` is passed via `config.configurable`, never as a graph
state channel**. The model can influence state, but it can never write the user
identity, so retrieval and tool execution can never be scoped to another user.
Nodes read it through a `readUserId(config)` helper that throws if it is missing,
so an unscoped invocation fails loudly instead of leaking data.

## Checkpointing

`GraphCheckpointer` owns one checkpointer for the whole process:

- **Mongo mode** — wraps the existing default app `MongoClient` (never a new
  connection, and never the Knowledge/Atlas one) with `MongoDBSaver`, and creates
  its checkpoint indexes once on init (idempotent).
- **Memory mode** (`STORAGE_DRIVER=memory` / tests) — falls back to the official
  in-memory `MemorySaver` so graphs still compile and resume within the process.

`thread_id` is the `conversationId`, so a conversation's run persists and can
resume. Loop-control channels are reset each turn, so a resumed thread behaves
like a fresh one — conversational context is rebuilt from DB messages into the
graph input, so nothing is lost.

## Event contract

Both generators emit internal events that the orchestrator maps onto the public
SSE contract (`token` / `progress` / `done` / `error`); they are **never** sent to
the client directly.

- `token` — a text delta (streamed to the client).
- `progress` — a transient, human-readable status (e.g. while a tool runs). Not
  persisted.
- `final` — the complete answer; the tutor variant also carries citations.
- `error` — a `{ code, message }` pair mapped to the SSE `error` event.

## Testing

- `assistant/assistant-agent.spec.ts`, `tutor/tutor-agent.spec.ts` — graph
  behaviour (tool loop, turn cap, fallback, citations) against fakes.
- `checkpoint/checkpoint.spec.ts`, `checkpoint/checkpoint.provider.spec.ts` —
  mode selection and resume.
- `assistant-tools/retrieve-knowledge/retrieve-knowledge.tool.spec.ts` — the tool.
- Orchestrator specs and the `conversations` / `rag-tutor` e2e specs cover the
  end-to-end SSE contract.
