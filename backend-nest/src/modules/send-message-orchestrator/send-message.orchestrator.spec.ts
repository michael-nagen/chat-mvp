import { SendMessageOrchestrator } from './send-message.orchestrator';
import { MessagesService } from '../messages/messages.service';
import { ConversationsService } from '../conversations/conversations.service';
import { UnitOfWork, TxContext } from '../../common/storage/unit-of-work';
import { TUTOR_ASSISTANT_ID } from '../assistant/assistant.catalog';
import type { Message } from '../../common/storage/entities';

type CreateArgs = Parameters<MessagesService['create']>[0];

// Records every message created so we can assert exactly what was persisted.
class RecordingMessages {
  readonly created: CreateArgs[] = [];

  create(args: CreateArgs): Promise<Message> {
    this.created.push(args);
    return Promise.resolve({
      id: `m-${this.created.length}`,
      conversationId: args.conversationId,
      senderId: args.userId,
      content: args.content,
      createdAt: '2026-01-01T00:00:00.000Z',
      ...(args.metadata ? { metadata: args.metadata } : {}),
    });
  }
}

class StubConversations {
  readonly lastMessageUpdates: unknown[] = [];

  constructor(private readonly conversation: unknown) {}

  getById(): Promise<unknown> {
    return Promise.resolve(this.conversation);
  }

  updateLastMessage(args: unknown): Promise<void> {
    this.lastMessageUpdates.push(args);
    return Promise.resolve();
  }
}

class ImmediateUnitOfWork {
  run<T>(work: (tx: TxContext | undefined) => Promise<T>): Promise<T> {
    return work(undefined);
  }
}

function createOrchestrator({ conversation }: { conversation: unknown }): {
  orchestrator: SendMessageOrchestrator;
  messages: RecordingMessages;
} {
  const messages = new RecordingMessages();
  const orchestrator = new SendMessageOrchestrator(
    messages as unknown as MessagesService,
    new StubConversations(conversation) as unknown as ConversationsService,
    new ImmediateUnitOfWork() as unknown as UnitOfWork,
  );
  return { orchestrator, messages };
}

describe('SendMessageOrchestrator', () => {
  // Tutor replies now stream (and persist) via the AI stream path, so the POST
  // that stores the question must never also create a tutor reply — that would
  // double-persist the answer.
  it('persists only the user message for a tutor conversation and requires an AI stream', async () => {
    const { orchestrator, messages } = createOrchestrator({
      conversation: {
        id: 'c-1',
        type: 'tutor',
        participantIds: ['u-1', TUTOR_ASSISTANT_ID],
      },
    });

    const result = await orchestrator.execute({
      conversationId: 'c-1',
      userId: 'u-1',
      content: 'What is RAG?',
    });

    expect(messages.created).toHaveLength(1);
    expect(messages.created[0].userId).toBe('u-1');
    expect(messages.created.some((m) => m.userId === TUTOR_ASSISTANT_ID)).toBe(false);
    expect(result.message.content).toBe('What is RAG?');
    expect(result.aiReply).toEqual({ required: true, conversationType: 'tutor' });
  });

  it('requires an AI stream for an assistant conversation', async () => {
    const { orchestrator, messages } = createOrchestrator({
      conversation: {
        id: 'c-1',
        type: 'assistant',
        participantIds: ['u-1', 'general-assistant'],
      },
    });

    const result = await orchestrator.execute({
      conversationId: 'c-1',
      userId: 'u-1',
      content: 'hello',
    });

    expect(messages.created).toHaveLength(1);
    expect(result.aiReply).toEqual({ required: true, conversationType: 'assistant' });
  });

  it('requires no AI stream for a dm conversation', async () => {
    const { orchestrator, messages } = createOrchestrator({
      conversation: {
        id: 'c-1',
        type: 'dm',
        participantIds: ['u-1', 'u-2'],
      },
    });

    const result = await orchestrator.execute({
      conversationId: 'c-1',
      userId: 'u-1',
      content: 'hi',
    });

    expect(messages.created).toHaveLength(1);
    expect(messages.created.every((m) => m.userId === 'u-1')).toBe(true);
    expect(result.aiReply).toEqual({ required: false });
  });

  it('requires no AI stream for a group conversation', async () => {
    const { orchestrator } = createOrchestrator({
      conversation: {
        id: 'c-1',
        type: 'group',
        participantIds: ['u-1', 'u-2', 'u-3'],
      },
    });

    const result = await orchestrator.execute({
      conversationId: 'c-1',
      userId: 'u-1',
      content: 'hi all',
    });

    expect(result.aiReply).toEqual({ required: false });
  });
});
