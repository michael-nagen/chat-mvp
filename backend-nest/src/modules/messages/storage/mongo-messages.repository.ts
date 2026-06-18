import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, FilterQuery, Model } from 'mongoose';
import { Message } from '../../memory/entities';
import { TxContext } from '../../../common/storage/unit-of-work';
import { MessagesRepository } from '../messages.repository';
import { MessageDoc, MessageDocument } from './messages.schema';
import { decodeCursor } from '../messages.cursor';

// Mongo driver. Keyset pagination on (createdAt, _id), index-backed by
// (conversationId, createdAt, _id).
@Injectable()
export class MongoMessagesRepository extends MessagesRepository {
  constructor(
    @InjectModel(MessageDoc.name)
    private readonly model: Model<MessageDocument>,
  ) {
    super();
  }

  async findPage({
    conversationId,
    cursor,
    limit,
  }: {
    conversationId: string;
    cursor: string | undefined;
    limit: number;
  }): Promise<Message[]> {
    const filter: FilterQuery<MessageDocument> = { conversationId };
    if (cursor) {
      const { createdAt, id } = decodeCursor(cursor);
      filter.$or = [
        { createdAt: { $gt: createdAt } },
        { createdAt, _id: { $gt: id } },
      ];
    }
    const docs = await this.model
      .find(filter)
      .sort({ createdAt: 1, _id: 1 })
      .limit(limit + 1)
      .lean()
      .exec();
    return docs.map((doc) => this.toEntity(doc));
  }

  async matchContent({
    conversationIds,
    needle,
    cursor,
    limit,
  }: {
    conversationIds: Set<string>;
    needle: string;
    cursor: string | undefined;
    limit: number;
  }): Promise<Message[]> {
    const filter: FilterQuery<MessageDocument> = {
      conversationId: { $in: [...conversationIds] },
      content: { $regex: escapeRegex(needle), $options: 'i' },
    };
    if (cursor) {
      const { createdAt, id } = decodeCursor(cursor);
      filter.$or = [
        { createdAt: { $lt: createdAt } },
        { createdAt, _id: { $lt: id } },
      ];
    }
    const docs = await this.model
      .find(filter)
      .sort({ createdAt: -1, _id: -1 })
      .limit(limit + 1)
      .lean()
      .exec();
    return docs.map((doc) => this.toEntity(doc));
  }

  async insert(message: Message, tx?: TxContext): Promise<Message> {
    await this.model.create(
      [
        {
          _id: message.id,
          conversationId: message.conversationId,
          senderId: message.senderId,
          content: message.content,
          createdAt: new Date(message.createdAt),
        },
      ],
      { session: tx as ClientSession | undefined },
    );
    return message;
  }

  private toEntity(doc: MessageDoc): Message {
    return {
      id: doc._id,
      conversationId: doc.conversationId,
      senderId: doc.senderId,
      content: doc.content,
      createdAt: doc.createdAt.toISOString(),
    };
  }
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
