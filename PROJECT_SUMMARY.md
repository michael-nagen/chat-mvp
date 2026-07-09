# Chat MVP — Project Handoff Summary

> Audience: an AI assistant helping plan and build the next features.
> Written from the actual codebase on branch `feat/assistant-mode` (2026-06-29).
> Where something couldn't be confirmed it's marked **unclear**.

---

## 1. Project overview

- **What it is:** A full-stack real-time chat application with an integrated **AI assistant mode**. Users have DM, group, and "assistant" conversations. Sending a message to an assistant conversation triggers an LLM reply that is **streamed token-by-token over SSE**.
- **Problem it solves:** A messaging app where you can chat both with other people and with a built-in AI assistant in the same UI, with the assistant modeled as a first-class conversation type rather than a bolted-on chatbot.
- **User/customer:** Looks like a learning/portfolio MVP (Masterschool fellowship context). No real multi-tenant product; seed users are `alice@example.com` … `heidi@example.com`, password `password`. End user = a logged-in person chatting with contacts and/or the assistant.
- **Current main flow:**
  1. Sign up / log in (email + password → JWT).
  2. See conversation list (left), select one, read messages (right).
  3. Compose a message → optimistic bubble → POST persists it.
  4. If the conversation is type `assistant`, the frontend then opens an SSE stream and renders the assistant reply live; backend persists the full reply only after the stream completes.
  5. Side features: create DM/group/assistant conversations, search messages (with recent-search history), edit profile (name, email, avatar with S3 upload).ש

---

## 2. Tech stack

**Frontend** (`vite-project/`)
- React 19, React Router 7, Vite 8, TypeScript (strict).
- No external state lib — **context + reducer per feature**.
- Plain `fetch` HTTP client + a custom SSE client (`fetch` streaming reader, not `EventSource`).
- Vitest + React Testing Library + jsdom.

**Backend** (`backend-nest/`) — the **active** backend
- NestJS 11, TypeScript (strict).
- Mongoose 8 (MongoDB) — **requires a replica set** for multi-doc transactions.
- `@nestjs/jwt` + Passport JWT, bcrypt for passwords.
- OpenAI SDK (`openai` v6, model `gpt-4o-mini`) behind a provider port.
- `gpt-tokenizer` for token-budgeting context.
- AWS S3 (`@aws-sdk/client-s3` + presigner) for avatars.
- `ioredis` for recent-search history (optional; falls back to in-memory).
- Zod 4 for tool I/O + eval validation; class-validator/class-transformer for DTOs.
- Jest + ts-jest + Supertest + `mongodb-memory-server` for tests.

**`backend/`** — a **legacy Express + Zod** backend. **Ignore it.** It predates the NestJS rewrite. (`PLAN_PART1.md` explicitly says to ignore it.)

**External services/APIs:** OpenAI (assistant), AWS S3 (avatars), Redis (recent searches), MongoDB.

**Dev tools:** ESLint + Prettier (frontend), Nest CLI, ts-node seed/verify/eval scripts.

---

## 3. Current architecture

### Repo layout
```
vite-project/    # React frontend (ACTIVE)
backend-nest/    # NestJS backend (ACTIVE)
backend/         # legacy Express backend (IGNORE)
API_CONTRACT.md  # HTTP contract (NOTE: partly stale, see §6)
docs/architecture/  # backend & frontend architecture PNGs
PLAN*.md, PR_*.md   # design/handoff notes for the assistant feature (good reading)
```

### Backend structure (`backend-nest/src`)
Layering: **Controller → Orchestrator → Service(s) → Repository → Storage driver (mongo | memory)**.

- `modules/controllers/` — all 6 HTTP controllers, thin: wire request → orchestrator → DTO.
- `modules/<use-case>-orchestrator/` — one orchestrator per use case (e.g. `send-message-orchestrator`, `create-dm-orchestrator`, `list-conversations-orchestrator`, `stream-assistant-reply-orchestrator`). Each declares typed Input/Output and composes services.
- Domain modules: `auth/`, `user/`, `conversations/`, `messages/`.
- **Storage**: each entity has dual drivers — a Mongo repo (`mongo-*.repository.ts` + `*.schema.ts`) and an in-memory repo (`in-memory-*.repository.ts`, backed by `memory/in-memory-store.service.ts`). A single `const DRIVER` per module + `repositoryStorage()` in `common/storage/storage.config.ts` binds the port to a driver; `STORAGE_DRIVER` env overrides for tests.
- **Transactions**: `UnitOfWork` port — `MongoUnitOfWork` (ClientSession) vs `InMemoryUnitOfWork` (no-op). Orchestrators use `unitOfWork.run(tx => …)` for atomic multi-write (e.g. create message + update conversation preview).
- **Assistant subsystem** (the interesting part): `ai-provider/` (LlmProvider port + OpenAI adapter), `assistant/` (registry + catalog of built-in assistants), `assistant-context/` (history fetch + 10k-token budgeting via gpt-tokenizer), `assistant-tools/` (tool registry + executor + `list_my_conversations` tool), `stream-assistant-reply-orchestrator/` (the SSE + tool loop), `prompts/assistant-system.prompt.ts`, `eval/` (LLM-as-judge eval harness).
- `common/` — error envelope (`AppException` hierarchy + `error-codes.ts`), `AllExceptionsFilter` (uniform `{ error: { code, message } }`), `LoggingInterceptor`.
- `main.ts` — CORS allowlist (`CORS_ORIGIN`), global `ValidationPipe({ whitelist, transform })`, global filter + interceptor, shutdown hooks, port 3000.

### Frontend structure (`vite-project/src`)
- **Feature folders** (`features/*`), each self-contained: a component, a `*.context.ts`, a controller hook (`use*Controller` / `*.use.ts`) wrapping a reducer, a `*.types.ts`, and a `model/*.api.ts` adapter for HTTP.
- Provider nesting: `AuthProvider` (in `main.tsx`) → Router → `ToastProvider` (in `App.tsx`) → on the chat page: `ChatSelectionProvider` → `ChatParticipantsProvider` → `MessageThreadProvider`.
- **Routing** (`routing/`): `/login` (gated by `LoginGate`), `/chat` and `/profile` (gated by `RequireAuth`), `*` → redirect. Auth read from `useAuth()`.
- **Shared** (`shared/`): `api/apiClient.ts` (base URL `http://localhost:3000` via `VITE_API_BASE_URL`, injects Bearer token), `api/sseClient.ts` (`streamEvents` fetch-stream SSE parser), `entities/` (Message/Conversation/User types + `Message.mapper.ts`), `components/` (Avatar, TextField, Modal…), `hooks/`, `styles/colors.ts` (design tokens), `utils/` (time formatting).

### Data flow (assistant reply, end to end)
1. FE `messageComposer` optimistically adds the user bubble, POSTs `/conversations/:id/messages`, confirms/rolls back.
2. If conversation type is `assistant`, `useAssistantReply` adds an empty assistant bubble and opens SSE `GET /conversations/:id/assistant/stream` (Bearer header → must use fetch streaming, not `EventSource`).
3. Backend `StreamAssistantReplyOrchestrator`: `AssistantConversationGuard` checks participant + type; `AssistantContextService` builds token-budgeted history; loops (≤5 iterations) calling `LlmProvider.streamTurn` → emits `token` deltas; if the model requests a tool, `ToolExecutor` Zod-validates input, injects JWT `userId`, runs it, validates output, feeds result back.
4. On completion the full reply is persisted (message + conversation preview) in one transaction; emits `done` with `messageId`. On any failure emits `error` and **persists nothing**.
5. FE appends each `token` delta to the message-thread reducer; `done` stamps the real id; error rolls back the bubble.

---

## 4. Core features already implemented

- **Auth:** signup + login (email/password, bcrypt, JWT). All non-auth routes guarded by `JwtAuthGuard`; `@CurrentUser()` injects the authed user.
- **Conversations:** list (sorted by recency), create DM (idempotent — returns existing), create group, create assistant conversation. Participant ids resolved to summaries (name/avatar) via a resolver; mapped to DTOs by mappers.
- **Messages:** cursor-paginated list, create (optimistic on FE), updates conversation preview atomically.
- **Message search:** `GET /messages/search?q=&cursor=&limit=` (paginated) + recent-search history (`GET /search/recent`, Redis or in-memory, capped at 10, deduped).
- **Profile:** edit name, edit email, avatar upload via S3 presigned PUT (`presign` → client uploads → `PUT /me/avatar` commits after a HeadObject size/existence check ≤5MB), remove avatar.
- **AI assistant:** streaming replies over SSE, capped agentic tool loop, one tool (`list_my_conversations`, user-scoped), prompts-as-code, and an `npm run eval` LLM-as-judge harness (7 cases, last run 5/7).

### Important endpoints
- `POST /auth/signup`, `POST /auth/login`
- `GET /me`, `GET /me/contacts`, `PATCH /me/name`, `PATCH /me/email`, `POST /me/avatar/presign`, `PUT /me/avatar`, `DELETE /me/avatar`
- `GET /conversations`, `POST /conversations/dm`, `POST /conversations/groups`, `POST /conversations/assistant`
- `GET /conversations/:id/messages`, `POST /conversations/:id/messages`
- `GET /messages/search`, `GET /search/recent`
- `GET /conversations/:id/assistant/stream` (SSE)

### Key business logic
- Conversation key normalization makes DM creation idempotent (partial unique index on `conversationKey` for DMs).
- Assistant is a **conversation type**, not a participant/`assistantId` field — `AssistantRegistry` decides which participant id is a built-in assistant.
- Tools never receive a `userId` from the model — it's injected from the JWT (security boundary).
- Persist-after-success-only for assistant replies.

---

## 5. Current data models

**User** (`users`): `id` (string `u-…`, not ObjectId), `email`, `firstName`, `lastName`, `passwordHash` (internal, never in DTOs), `contactIds: string[]` (capped, see `MAX_CONTACTS_PER_USER`), `avatarUrl?`, `avatarKey?` (internal), `createdAt`.

**Conversation** (`conversations`): `id`, `type: 'dm' | 'group' | 'assistant'`, `title`, `participantIds: string[]`, `lastMessage` (preview), `updatedAt`/`lastMessageAt`, `conversationKey` (normalized, unique for DMs), `createdAt`.

**Message** (`messages`): `id`, `conversationId`, `senderId`, `content`, `createdAt`. Sender role on the wire is derived: `senderId === assistant id` → `assistant`, else `user`. (FE `Message.mapper.ts` maps `RawMessage` → `Message` with `sender: 'user' | 'assistant'` relative to current user.)

**RecentSearch:** per-user list of last 10 queries (Redis key `recent-searches:{userId}` or in-memory).

**Relationships:** User —< participates in >— Conversation (via `participantIds`); Conversation —< has many >— Message; User —< contactIds >— User (contacts). Assistant identity is implicit (registry), not a stored User row.

---

## 6. Open issues / technical debt

- **Docs are partly stale — biggest trap for a new contributor:**
  - `README.md` describes the *old* world: Express backend, mock auth "log in by name (Alice/Bob)", in-memory store, no DB. Reality is NestJS + Mongo + email/password JWT. **README must be rewritten.**
  - `API_CONTRACT.md` still references the Week-2 mock (`apiClient`/`mockServer`/`mokeapi`), login-by-`name`, and `EventSource`. The real auth is email+password and the FE uses fetch-streaming SSE. The domain shapes are mostly right; the auth + transport notes are not.
- **Two backends in the tree** (`backend/` legacy Express vs `backend-nest/`). The dead one should be removed or clearly archived to avoid confusion.
- **Uncommitted change** on `user.schema.ts`: only strips comments (consistent with the project's "comments explain why not what" rule). Harmless but uncommitted.
- **Tests:** backend has unit + e2e (Jest/Supertest, memory driver) for auth/conversations/messages/user/contacts. **No automated test of the assistant streaming/tool loop** (only manual `verify:assistant` script + `eval`). Frontend has 13 Vitest files but **`MessageComposer.api.test.ts` hits the live backend** (`localhost:3000`) — fragile, not hermetic.
- **Security/robustness to review:**
  - Confirm the SSE endpoint enforces auth + participant/type guard on every path (it appears to via `AssistantConversationGuard`).
  - OpenAI key is env-only by design; verify it's never logged.
  - Message search: contract warned against unbounded scans — confirm the limit is actually enforced server-side.
- **Performance:** assistant history truncated to ~10k tokens (recall vs cost tradeoff, intentional). Mongo requires a replica set locally (extra setup friction). Redis optional.
- **Unclear:** exact `MAX_CONTACTS_PER_USER` value; whether group conversations also normalize/uniquify by key; whether there's any rate limiting on the SSE/LLM endpoint.

---

## 7. How to run the project

**Prereqs:** Node, a MongoDB **replica set** (single-node `rs0` via docker-compose is fine), optionally Redis, optionally AWS S3 creds, an OpenAI key for live assistant.

**Backend** (`backend-nest/`)
```bash
cp .env.example .env   # then fill in values
npm install
npm run seed           # ts-node src/scripts/seed.ts — seeds users/conversations/messages
npm run start:dev      # nest start --watch, http://localhost:3000
npm test               # jest (forces STORAGE_DRIVER=memory, AVATAR_STORAGE=fake)
npm run eval           # LLM-as-judge eval (needs OPENAI_API_KEY; skips live if absent)
npm run verify:assistant   # manual live assistant smoke test
```
Required env: `JWT_SECRET` (boot-blocking), `MONGO_URI` (replica set; boot-blocking under mongo driver). Optional/feature: `OPENAI_API_KEY`, `STORAGE_DRIVER` (`mongo`|`memory`), `AVATAR_STORAGE` (`s3`|`fake`) + AWS vars, `REDIS_URL`, `PORT`, `CORS_ORIGIN`.

**Frontend** (`vite-project/`)
```bash
npm install
npm run dev     # http://localhost:5173 (expects backend on :3000)
npm test        # vitest
```
Fast local path: set backend `STORAGE_DRIVER=memory` + `AVATAR_STORAGE=fake` to skip Mongo/S3. Seed users log in with password `password` (e.g. `alice@example.com`).

---

## 8. Current git/project state

- **Branch:** `feat/assistant-mode` (main/PR base branch is `chat-mvp`).
- **Recent work (newest first):** documented assistant API contract → FE streams assistant replies → FE assistant option in New Conversation → FE assistant reply feature + SSE client → BE eval harness → BE assistant HTTP routes → BE SSE + tool calling → BE assistant orchestration/registry/tools/context → BE AI provider port → BE assistant conversation type. In short: **the whole assistant feature was just built across BE then FE and is the head of this branch.**
- **Working tree:** 1 modified file (`user.schema.ts`, comment-stripping only); untracked planning docs (`PLAN_PART1.md`, `PR_PART3.md`, `PR_README.md`) — these are excellent design context.
- **Most important files for future work:**
  - Assistant loop: `backend-nest/src/modules/stream-assistant-reply-orchestrator/stream-assistant-reply.orchestrator.ts`
  - Provider port + adapter: `backend-nest/src/modules/ai-provider/{llm-provider.ts,openai.provider.ts}`
  - Tools: `backend-nest/src/modules/assistant-tools/` (registry, executor, `list-my-conversations`)
  - Context budgeting: `backend-nest/src/modules/assistant-context/assistant-context.service.ts`
  - Prompt: `backend-nest/src/prompts/assistant-system.prompt.ts`
  - FE streaming: `vite-project/src/features/assistantReply/useAssistantReply.ts`, `vite-project/src/shared/api/sseClient.ts`
  - FE message state: `vite-project/src/features/messageThread/model/MessageThread.reducer.ts`
  - Contract/conventions: `API_CONTRACT.md`, `CLAUDE.md` (hard project rules — read before coding).

---

## 9. Best next-step recommendation

The assistant exists but is thin: **one tool, one assistant, no tests on the live loop, and stale docs.** Strongest candidates (pick per goal):

1. **Add more assistant tools** (highest product value, lowest risk — the pattern is in place).
   - Likely files: new folder under `assistant-tools/<tool-name>/` (class with Zod `inputSchema`/`outputSchema` + `execute`), register it in `tool-registry`, no orchestrator changes needed. Reuse existing orchestrators (e.g. a `search_messages` tool wrapping `SearchMessagesOrchestrator`, or `send_message` / `create_conversation`).
   - Risks: tools that *write* data need careful auth scoping and idempotency; keep `userId` injection intact; respect the ≤5 iteration cap and cost.

2. **Test the assistant streaming + tool loop** (closes the biggest test gap).
   - Files: new `*.spec.ts` for `stream-assistant-reply.orchestrator` with a fake `LlmProvider` (the port exists precisely for this) and the memory driver; assert `token`/`done`/`error` sequencing, persist-after-success, and tool-loop cap.
   - Risks: must mock the provider deterministically; no live OpenAI in CI.

3. **Fix the docs** (cheap, high clarity payoff): rewrite `README.md` and reconcile `API_CONTRACT.md` with real auth (email/password) + transport (fetch SSE), and remove/archive the legacy `backend/`.

4. **Multiple assistants** (uses the catalog that's already built): expose assistant choice in the New Conversation flow and let `AssistantRegistry` resolve different system prompts.
   - Files: `assistant/assistant.catalog.ts`, the create-assistant DTO/orchestrator, and FE `newConversation`.

**Cross-cutting risks to keep in mind:** never let the model supply identifiers (always inject from JWT); preserve the persist-only-on-success rule; keep the uniform `{ error: { code, message } }` envelope (including SSE `error` events); follow `CLAUDE.md` (types in own files, orchestrator-through-service layering, context-as-state on FE, single object args).

---

### Quick orientation for the next assistant
- Active code = `vite-project/` + `backend-nest/`. Ignore `backend/`.
- Read `CLAUDE.md` first (binding conventions), then `PR_README.md` / `PR_PART3.md` for the assistant design rationale.
- Trust the code over `README.md`/`API_CONTRACT.md` where they disagree (auth + SSE transport notes are stale).
