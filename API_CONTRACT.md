# API Contract

This document defines the contract between the chat frontend and the backend.
Week 2 implements it as a typed in-memory mock. The shared API client
(`src/shared/api/apiClient.ts`) is only the request layer — it adds latency and
delegates to the mock server (`src/shared/api/mockServer.ts`), which reads and
mutates the seed data (`src/shared/api/mokeapi.ts`). Each feature owns the small
adapter that turns those minimal requests into the behavior it needs, kept in its
`model/*.api.ts` (e.g. `messageComposer/model/MessageComposer.api.ts`). Domain
types live in `src/shared/entities`. Week 3 implements the same shapes
server-side. If the contract changes, update this file.

All request/response bodies are JSON. Authenticated endpoints expect an
`Authorization: Bearer <token>` header (the token is returned by `POST /auth/login`).

---

## Domain types

```ts
type SenderRole = 'user' | 'assistant';

type User = {
  id: string;
  name: string;
};

type Conversation = {
  id: string;
  type: 'dm' | 'group' | 'assistant';  // assistant conversations stream replies
  title: string;
  lastMessage: string;       // preview of the most recent message
  updatedAt: string;         // ISO 8601 timestamp, used for sorting
  participantIds: string[];  // user ids that belong to this conversation
};

// In responses, conversations expose resolved `participants` (UserSummary[]).
// For an assistant conversation the built-in assistant appears as a participant
// summary (id = the assistant id, e.g. "general-assistant"), alongside the user.

type Message = {
  id: string;
  conversationId: string;
  content: string;
  sender: SenderRole;
  timestamp: string;         // ISO 8601 timestamp
};
```

---

## Endpoints

### POST /auth/login

Mocked authentication — logs in as an existing user identity by name
(no password this week).

**Request**

```json
{ "name": "Alice" }
```

**Response — 200**

```json
{
  "token": "mock-token-u1",
  "user": { "id": "u1", "name": "Alice" }
}
```

**Errors**

- `401 Unauthorized` — no user matches the given name (`{ "error": "User not found" }`).

---

### GET /conversations

Returns the conversations the authenticated user is a participant of,
sorted by `updatedAt` descending (most recent first).

**Response — 200**

```json
{
  "conversations": [
    {
      "id": "2",
      "title": "Project Discussion",
      "lastMessage": "Let's discuss the project requirements.",
      "updatedAt": "2026-05-30T10:00:00.000Z",
      "participantIds": ["u1", "u2"]
    }
  ]
}
```

---

### GET /conversations/:id/messages?cursor=&limit=

Returns a page of messages for a conversation, oldest → newest within the page.
Cursor-based pagination keeps long threads from loading all at once.

**Query parameters**

| Param    | Type   | Default | Description                                        |
| -------- | ------ | ------- | -------------------------------------------------- |
| `cursor` | string | —       | Opaque cursor from a previous response. Omit for the first (most recent) page. |
| `limit`  | number | `20`    | Max messages per page.                             |

**Response — 200**

```json
{
  "messages": [
    {
      "id": "m1",
      "conversationId": "1",
      "content": "Hello! How can I assist you today?",
      "sender": "assistant",
      "timestamp": "2026-05-30T09:59:00.000Z"
    }
  ],
  "nextCursor": "m1"
}
```

- `nextCursor` is an opaque string to pass as `cursor` for the next (older) page,
  or `null` when there are no more messages.

---

### POST /conversations/:id/messages

Creates a new message in the conversation, authored by the current user.

**Request**

```json
{ "content": "I need help with my project." }
```

**Response — 201**

```json
{
  "message": {
    "id": "m-1717061940000",
    "conversationId": "1",
    "content": "I need help with my project.",
    "sender": "user",
    "timestamp": "2026-05-30T10:00:00.000Z"
  }
}
```

The client sends this message optimistically: it is shown immediately with a
temporary id, replaced by the returned message on success, and rolled back if
the request fails.

---

## Assistant conversations

An `assistant` conversation is a single-user chat with the AI. It is created
like other conversations but has no other participants.

### POST /conversations/assistant

Creates an assistant conversation owned by the current user.

**Request** — `title` is optional (defaults to `"Assistant"`).

```json
{ "title": "Planning helper" }
```

**Response — 201** — a `Conversation` (the only participant is the current user).

### Assistant reply flow (streaming)

Sending a message to an assistant conversation is two steps:

1. **Persist the user message** with the normal `POST /conversations/:id/messages`
   (unchanged contract above).
2. **Open the reply stream** below; the assistant reply is generated from the
   conversation's recent context and streamed back token by token.

### GET /conversations/:conversationId/assistant/stream  (Server-Sent Events)

Streams the assistant's reply for the conversation's current context. Requires
`Authorization: Bearer <token>`. Returns `4xx` (not a stream) when the
conversation is missing (`404`), the user is not a participant (`403`), or it is
not an assistant conversation (`400`) — using the standard
`{ "error": { "code", "message" } }` envelope.

On success the response is an SSE stream (`Content-Type: text/event-stream`).
Consume it with `EventSource` or a `fetch` streaming body reader. Event names:

| `event` | `data` (JSON)                       | Meaning                                   |
| ------- | ----------------------------------- | ----------------------------------------- |
| `token` | `{ "delta": "..." }`                | An incremental text chunk of the reply.   |
| `done`  | `{ "messageId": "m-..." }`          | Reply complete and persisted to MongoDB.  |
| `error` | `{ "code": "...", "message": "..." }` | Generation failed; nothing was persisted. |

The full assistant message is accumulated server-side and persisted as a single
message (sender `assistant`) **only after** the stream completes successfully;
on `error` no partial message is written.

```
event: token
data: {"delta":"Hello"}

event: token
data: {"delta":"!"}

event: done
data: {"messageId":"m-1717061940000"}
```

---

## Notes & deviations (Week 2 mock)

- **Login by name**: the mock authenticates by matching `name` against a fixed
  user list (`Alice`, `Bob`). A real backend would use credentials; the
  `{ token, user }` response shape stays the same.
- **In-memory state**: conversations and messages live in memory and reset on
  reload. The auth token/user is persisted in `localStorage`.
