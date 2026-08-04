import { Injectable, MessageEvent } from '@nestjs/common';
import { AssistantContextService } from '../assistant-context/assistant-context.service';
import { MessagesService } from '../messages/messages.service';
import { ConversationsService } from '../conversations/conversations.service';
import { UnitOfWork } from '../../common/storage/unit-of-work';
import {
  Conversation,
  Message,
  MessageMetadata,
} from '../../common/storage/entities';
import { AssistantRegistry } from '../assistant/assistant.registry';
import { TUTOR_ASSISTANT_ID } from '../assistant/assistant.catalog';
import { AgentService } from '../agent/agent.service';
import type { StreamAssistantReplyInput } from './stream-assistant-reply.module';
import type {
  DoneEventData,
  ErrorEventData,
  ProgressEventData,
  TokenEventData,
  TutorDoneEventData,
} from './assistant-stream.types';

const GENERATION_FAILED_CODE = 'ASSISTANT_GENERATION_FAILED';
const NO_QUESTION_CODE = 'TUTOR_NO_QUESTION';
// The tutor question is the caller's most recent message; look back a few to
// skip over any non-user event messages (e.g. a knowledge-upload notice).
const QUESTION_LOOKBACK = 10;

@Injectable()
export class StreamAssistantReplyOrchestrator {
  constructor(
    private readonly assistantContext: AssistantContextService,
    private readonly messages: MessagesService,
    private readonly conversations: ConversationsService,
    private readonly assistants: AssistantRegistry,
    private readonly agent: AgentService,
    private readonly unitOfWork: UnitOfWork,
  ) {}

  async *execute({
    conversationId,
    userId,
  }: StreamAssistantReplyInput): AsyncGenerator<MessageEvent> {
    const conversation = await this.conversations.getById(conversationId);
    if (conversation?.type === 'tutor') {
      yield* this.streamTutor({ conversationId, userId });
      return;
    }
    yield* this.streamAssistant({ conversationId, userId, conversation });
  }

  private async *streamAssistant({
    conversationId,
    userId,
    conversation,
  }: {
    conversationId: string;
    userId: string;
    conversation: Conversation | undefined;
  }): AsyncGenerator<MessageEvent> {
    const assistant = this.resolveAssistant({ conversation });
    const messages = await this.assistantContext.prepare({
      conversationId,
      assistantParticipantId: assistant.id,
    });

    let answer: string | undefined;
    for await (const event of this.agent.streamAssistantTurn({
      userId,
      conversationId,
      messages,
      assistantId: assistant.id,
    })) {
      if (event.type === 'token') {
        const data: TokenEventData = { delta: event.delta };
        yield { type: 'token', data };
      } else if (event.type === 'progress') {
        const data: ProgressEventData = { label: event.label };
        yield { type: 'progress', data };
      } else if (event.type === 'final') {
        answer = event.answer;
      } else {
        const data: ErrorEventData = { code: event.code, message: event.message };
        yield { type: 'error', data };
        return;
      }
    }

    if (answer === undefined) {
      const data: ErrorEventData = {
        code: GENERATION_FAILED_CODE,
        message: 'Failed to generate a response.',
      };
      yield { type: 'error', data };
      return;
    }

    const reply = await this.persistReply({
      conversationId,
      content: answer,
      senderId: assistant.id,
    });
    const data: DoneEventData = { messageId: reply.id };
    yield { type: 'done', data };
  }

  private async *streamTutor({
    conversationId,
    userId,
  }: {
    conversationId: string;
    userId: string;
  }): AsyncGenerator<MessageEvent> {
    const question = await this.latestQuestion({ conversationId, userId });
    if (question === undefined) {
      const data: ErrorEventData = {
        code: NO_QUESTION_CODE,
        message: 'No question was found to answer.',
      };
      yield { type: 'error', data };
      return;
    }

    let answer: string | undefined;
    let citations: TutorDoneEventData['citations'] = [];
    for await (const event of this.agent.streamTutorTurn({
      userId,
      conversationId,
      question,
    })) {
      if (event.type === 'progress') {
        const data: ProgressEventData = { label: event.label };
        yield { type: 'progress', data };
      } else if (event.type === 'token') {
        const data: TokenEventData = { delta: event.delta };
        yield { type: 'token', data };
      } else if (event.type === 'final') {
        answer = event.answer;
        citations = event.citations;
      } else {
        const data: ErrorEventData = { code: event.code, message: event.message };
        yield { type: 'error', data };
        return;
      }
    }

    if (answer === undefined) {
      const data: ErrorEventData = {
        code: GENERATION_FAILED_CODE,
        message: 'Failed to generate a response.',
      };
      yield { type: 'error', data };
      return;
    }

    const metadata: MessageMetadata | undefined =
      citations.length > 0 ? { citations } : undefined;
    const reply = await this.persistReply({
      conversationId,
      content: answer,
      senderId: TUTOR_ASSISTANT_ID,
      metadata,
    });
    const data: TutorDoneEventData = { messageId: reply.id, citations };
    yield { type: 'done', data };
  }

  private async latestQuestion({
    conversationId,
    userId,
  }: {
    conversationId: string;
    userId: string;
  }): Promise<string | undefined> {
    const recent = await this.messages.listRecent({
      conversationId,
      limit: QUESTION_LOOKBACK,
    });
    for (let i = recent.length - 1; i >= 0; i -= 1) {
      if (recent[i].senderId === userId) {
        return recent[i].content;
      }
    }
    return undefined;
  }

  private resolveAssistant({
    conversation,
  }: {
    conversation: Conversation | undefined;
  }) {
    const assistantParticipantId = conversation?.participantIds.find((id) =>
      this.assistants.isAssistant({ participantId: id }),
    );
    return this.assistants.resolve({ assistantId: assistantParticipantId });
  }

  private persistReply({
    conversationId,
    content,
    senderId,
    metadata,
  }: {
    conversationId: string;
    content: string;
    senderId: string;
    metadata?: MessageMetadata;
  }): Promise<Message> {
    return this.unitOfWork.run(async (tx) => {
      const reply = await this.messages.create(
        { conversationId, userId: senderId, content, metadata },
        tx,
      );
      await this.conversations.updateLastMessage(
        { id: conversationId, lastMessage: content, updatedAt: reply.createdAt },
        tx,
      );
      return reply;
    });
  }
}
