import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model } from 'mongoose';
import { Conversation } from '../../../common/storage/entities';
import { TxContext } from '../../../common/storage/unit-of-work';
import { ConversationsRepository } from '../conversations.repository';
import { ConflictException } from '../../../common/errors/app.exception';
import { ConversationDoc, ConversationDocument } from './conversations.schema';

const MONGO_DUPLICATE_KEY = 11000;

const isDuplicateKeyError = (error: unknown): boolean =>
  typeof error === 'object' &&
  error !== null &&
  (error as { code?: number }).code === MONGO_DUPLICATE_KEY;

// Mongo driver for conversations. `lastMessageAt` (Date) surfaces as the
// entity's `updatedAt` (ISO string).
@Injectable()
export class MongoConversationsRepository extends ConversationsRepository {
  constructor(
    @InjectModel(ConversationDoc.name)
    private readonly model: Model<ConversationDocument>,
  ) {
    super();
  }

  // Sorted by last activity (uses the (participantIds, lastMessageAt desc) index).
  async getForUser(userId: string): Promise<Conversation[]> {
    const docs = await this.model
      .find({ participantIds: userId })
      .sort({ lastMessageAt: -1 })
      .lean()
      .exec();
    return docs.map((doc) => this.toEntity(doc));
  }

  async findByConversationKey(
    conversationKey: string,
  ): Promise<Conversation | undefined> {
    const doc = await this.model.findOne({ conversationKey }).lean().exec();
    return doc ? this.toEntity(doc) : undefined;
  }

  async insert(conversation: Conversation): Promise<Conversation> {
    try {
      await this.model.create({
        _id: conversation.id,
        participantIds: conversation.participantIds,
        type: conversation.type,
        conversationKey: conversation.conversationKey,
        title: conversation.title,
        lastMessage: conversation.lastMessage,
        lastMessageAt: new Date(conversation.updatedAt),
        createdAt: new Date(conversation.updatedAt),
      });
    } catch (error) {
      // Concurrent creates race past the service-level pre-check; the DM
      // uniqueness index is what actually rejects the loser (E11000).
      if (isDuplicateKeyError(error)) {
        throw new ConflictException('Conversation already exists.');
      }
      throw error;
    }
    return conversation;
  }

  async findById(id: string): Promise<Conversation | undefined> {
    const doc = await this.model.findById(id).lean().exec();
    return doc ? this.toEntity(doc) : undefined;
  }

  async updateLastMessage(
    {
      id,
      lastMessage,
      updatedAt,
    }: {
      id: string;
      lastMessage: string;
      updatedAt: string;
    },
    tx?: TxContext,
  ): Promise<Conversation | undefined> {
    const doc = await this.model
      .findByIdAndUpdate(
        id,
        { lastMessage, lastMessageAt: new Date(updatedAt) },
        { new: true, session: tx as ClientSession | undefined },
      )
      .lean()
      .exec();
    return doc ? this.toEntity(doc) : undefined;
  }

  private toEntity(doc: ConversationDoc): Conversation {
    return {
      id: doc._id,
      title: doc.title,
      lastMessage: doc.lastMessage,
      updatedAt: doc.lastMessageAt.toISOString(),
      participantIds: doc.participantIds,
      type: doc.type,
      conversationKey: doc.conversationKey,
    };
  }
}
