import { MessageEvent } from '@nestjs/common';
import { StreamAssistantReplyOrchestrator } from './stream-assistant-reply.orchestrator';
import { AssistantRegistry } from '../assistant/assistant.registry';
import { TUTOR_ASSISTANT_ID } from '../assistant/assistant.catalog';
import type { AssistantContextService } from '../assistant-context/assistant-context.service';
import type { MessagesService } from '../messages/messages.service';
import type { ConversationsService } from '../conversations/conversations.service';
import type { AgentService } from '../agent/agent.service';
import type { UnitOfWork } from '../../common/storage/unit-of-work';
import type { Conversation, Message } from '../../common/storage/entities';
import type { AssistantAgentEvent } from '../agent/assistant/assistant-agent.types';
import type { TutorAgentEvent } from '../agent/tutor/tutor-agent.types';

const assistantConversation: Conversation = {
  id: 'c-1',
  type: 'assistant',
  title: 'Assistant',
  participantIds: ['u1', 'general-assistant'],
  lastMessage: '',
  updatedAt: new Date(),
  lastMessageAt: new Date(),
  conversationKey: 'c-1',
  createdAt: new Date(),
} as unknown as Conversation;

function createOrchestrator({
  conversation,
  agentEvents = [],
  tutorEvents = [],
  recent = [],
}: {
  conversation: Conversation | undefined;
  agentEvents?: AssistantAgentEvent[];
  tutorEvents?: TutorAgentEvent[];
  recent?: Array<{ senderId: string; content: string }>;
}) {
  const messagesCreate = jest.fn(
    (args: { conversationId: string; userId: string; content: string; metadata?: unknown }) =>
      Promise.resolve({
        id: 'm-reply',
        conversationId: args.conversationId,
        senderId: args.userId,
        content: args.content,
        createdAt: new Date(),
        ...(args.metadata ? { metadata: args.metadata } : {}),
      } as unknown as Message),
  );
  const listRecent = jest.fn().mockResolvedValue(recent);
  const updateLastMessage = jest.fn().mockResolvedValue(undefined);
  const streamAssistantTurn = jest.fn(
    async function* (): AsyncGenerator<AssistantAgentEvent> {
      for (const event of agentEvents) {
        yield event;
      }
    },
  );
  const streamTutorTurn = jest.fn(async function* (): AsyncGenerator<TutorAgentEvent> {
    for (const event of tutorEvents) {
      yield event;
    }
  });

  const orchestrator = new StreamAssistantReplyOrchestrator(
    {
      prepare: jest.fn().mockResolvedValue([{ role: 'user', content: 'hi' }]),
    } as unknown as AssistantContextService,
    { create: messagesCreate, listRecent } as unknown as MessagesService,
    {
      getById: jest.fn().mockResolvedValue(conversation),
      updateLastMessage,
    } as unknown as ConversationsService,
    new AssistantRegistry(),
    { streamAssistantTurn, streamTutorTurn } as unknown as AgentService,
    {
      run: (work: (tx: undefined) => Promise<unknown>) => work(undefined),
    } as unknown as UnitOfWork,
  );

  return { orchestrator, messagesCreate, streamAssistantTurn, streamTutorTurn };
}

async function drain(
  generator: AsyncGenerator<MessageEvent>,
): Promise<MessageEvent[]> {
  const events: MessageEvent[] = [];
  for await (const event of generator) {
    events.push(event);
  }
  return events;
}

const tutorConversation = {
  ...assistantConversation,
  type: 'tutor',
  participantIds: ['u1', TUTOR_ASSISTANT_ID],
} as unknown as Conversation;

describe('StreamAssistantReplyOrchestrator', () => {
  it('maps assistant token/final to SSE token/done and persists once on success', async () => {
    const { orchestrator, messagesCreate } = createOrchestrator({
      conversation: assistantConversation,
      agentEvents: [
        { type: 'token', delta: 'Hel' },
        { type: 'token', delta: 'lo' },
        { type: 'final', answer: 'Hello' },
      ],
    });

    const events = await drain(
      orchestrator.execute({ conversationId: 'c-1', userId: 'u1' }),
    );

    expect(events).toEqual([
      { type: 'token', data: { delta: 'Hel' } },
      { type: 'token', data: { delta: 'lo' } },
      { type: 'done', data: { messageId: 'm-reply' } },
    ]);
    expect(messagesCreate).toHaveBeenCalledTimes(1);
  });

  it('maps an assistant progress event to an SSE progress event', async () => {
    const { orchestrator } = createOrchestrator({
      conversation: assistantConversation,
      agentEvents: [
        { type: 'progress', label: 'Looking up your conversations…' },
        { type: 'token', delta: 'Hi' },
        { type: 'final', answer: 'Hi' },
      ],
    });

    const events = await drain(
      orchestrator.execute({ conversationId: 'c-1', userId: 'u1' }),
    );

    expect(events).toContainEqual({
      type: 'progress',
      data: { label: 'Looking up your conversations…' },
    });
  });

  it('emits an error and persists nothing when the assistant errors', async () => {
    const { orchestrator, messagesCreate } = createOrchestrator({
      conversation: assistantConversation,
      agentEvents: [
        { type: 'token', delta: 'partial' },
        { type: 'error', code: 'ASSISTANT_GENERATION_FAILED', message: 'boom' },
      ],
    });

    const events = await drain(
      orchestrator.execute({ conversationId: 'c-1', userId: 'u1' }),
    );

    expect(events).toEqual([
      { type: 'token', data: { delta: 'partial' } },
      {
        type: 'error',
        data: { code: 'ASSISTANT_GENERATION_FAILED', message: 'boom' },
      },
    ]);
    expect(messagesCreate).not.toHaveBeenCalled();
  });

  it('streams a tutor reply, persisting once with citations echoed in done', async () => {
    const citation = {
      chunkId: 'kc-1',
      documentId: 'd1',
      documentName: 'x.md',
      chunkIndex: 0,
      score: 0.82,
    };
    const { orchestrator, messagesCreate, streamTutorTurn, streamAssistantTurn } =
      createOrchestrator({
        conversation: tutorConversation,
        recent: [{ senderId: 'u1', content: 'What is RAG?' }],
        tutorEvents: [
          { type: 'progress', label: 'Searching your documents…' },
          { type: 'token', delta: 'Grounded ' },
          { type: 'token', delta: 'answer.' },
          { type: 'final', answer: 'Grounded answer.', citations: [citation] },
        ],
      });

    const events = await drain(
      orchestrator.execute({ conversationId: 'c-1', userId: 'u1' }),
    );

    expect(streamAssistantTurn).not.toHaveBeenCalled();
    expect(streamTutorTurn).toHaveBeenCalledWith({
      userId: 'u1',
      conversationId: 'c-1',
      question: 'What is RAG?',
    });
    expect(events).toEqual([
      { type: 'progress', data: { label: 'Searching your documents…' } },
      { type: 'token', data: { delta: 'Grounded ' } },
      { type: 'token', data: { delta: 'answer.' } },
      { type: 'done', data: { messageId: 'm-reply', citations: [citation] } },
    ]);
    expect(messagesCreate).toHaveBeenCalledTimes(1);
    expect(messagesCreate.mock.calls[0][0]).toEqual({
      conversationId: 'c-1',
      userId: TUTOR_ASSISTANT_ID,
      content: 'Grounded answer.',
      metadata: { citations: [citation] },
    });
  });

  it('persists the tutor fallback without citations', async () => {
    const { orchestrator, messagesCreate } = createOrchestrator({
      conversation: tutorConversation,
      recent: [{ senderId: 'u1', content: 'unknown topic' }],
      tutorEvents: [
        { type: 'progress', label: 'Searching your documents…' },
        { type: 'token', delta: 'No relevant info.' },
        { type: 'final', answer: 'No relevant info.', citations: [] },
      ],
    });

    const events = await drain(
      orchestrator.execute({ conversationId: 'c-1', userId: 'u1' }),
    );

    expect(events).toContainEqual({
      type: 'done',
      data: { messageId: 'm-reply', citations: [] },
    });
    expect(messagesCreate.mock.calls[0][0]).toEqual({
      conversationId: 'c-1',
      userId: TUTOR_ASSISTANT_ID,
      content: 'No relevant info.',
      metadata: undefined,
    });
  });
});
