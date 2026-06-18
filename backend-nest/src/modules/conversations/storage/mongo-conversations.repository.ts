import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model } from 'mongoose';
import { Conversation } from '../../memory/entities';
import { TxContext } from '../../../common/storage/unit-of-work';
import { ConversationsRepository } from '../conversations.repository';
import { ConversationDoc, ConversationDocument } from './conversations.schema';

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

  async findBetween(
    userId: string,
    recipientId: string,
  ): Promise<Conversation | undefined> {
    const doc = await this.model
      .findOne({ participantIds: { $all: [userId, recipientId] } })
      .lean()
      .exec();
    return doc ? this.toEntity(doc) : undefined;
  }

  async insert(conversation: Conversation): Promise<Conversation> {
    await this.model.create({
      _id: conversation.id,
      participantIds: conversation.participantIds,
      title: conversation.title,
      lastMessage: conversation.lastMessage,
      lastMessageAt: new Date(conversation.updatedAt),
      createdAt: new Date(conversation.updatedAt),
    });
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
    };
  }
}
