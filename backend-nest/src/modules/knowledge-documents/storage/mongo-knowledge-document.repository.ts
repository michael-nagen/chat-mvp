import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model } from 'mongoose';
import { KnowledgeDocument } from '../../../common/storage/entities';
import { TxContext } from '../../../common/storage/unit-of-work';
import { KnowledgeDocumentRepository } from '../knowledge-document.repository';
import { ConflictException } from '../../../common/errors/app.exception';
import {
  KnowledgeDocumentDoc,
  KnowledgeDocumentDocument,
} from './knowledge-document.schema';
import { KNOWLEDGE_CONNECTION } from '../../knowledge-storage/knowledge-mongo-connection.module';

const MONGO_DUPLICATE_KEY = 11000;

const isDuplicateKeyError = (error: unknown): boolean =>
  typeof error === 'object' &&
  error !== null &&
  (error as { code?: number }).code === MONGO_DUPLICATE_KEY;

// Mongo driver for knowledge documents.
@Injectable()
export class MongoKnowledgeDocumentRepository extends KnowledgeDocumentRepository {
  constructor(
    @InjectModel(KnowledgeDocumentDoc.name, KNOWLEDGE_CONNECTION)
    private readonly model: Model<KnowledgeDocumentDocument>,
  ) {
    super();
  }

  async insert(
    document: KnowledgeDocument,
    tx?: TxContext,
  ): Promise<KnowledgeDocument> {
    try {
      await this.model.create(
        [
          {
            _id: document.id,
            userId: document.userId,
            fileName: document.fileName,
            contentType: document.contentType,
            contentHash: document.contentHash,
            status: document.status,
            chunkCount: document.chunkCount,
            createdAt: new Date(document.createdAt),
          },
        ],
        { session: tx as ClientSession | undefined },
      );
    } catch (error) {
      // Loser of a concurrent create that raced past the service pre-check; the
      // (userId, contentHash) unique index rejects it (E11000).
      if (isDuplicateKeyError(error)) {
        throw new ConflictException('Knowledge document already exists.');
      }
      throw error;
    }
    return document;
  }

  async findByUserAndHash({
    userId,
    contentHash,
  }: {
    userId: string;
    contentHash: string;
  }): Promise<KnowledgeDocument | undefined> {
    const doc = await this.model.findOne({ userId, contentHash }).lean().exec();
    return doc ? this.toEntity(doc) : undefined;
  }

  async getForUser(userId: string): Promise<KnowledgeDocument[]> {
    const docs = await this.model
      .find({ userId })
      .sort({ createdAt: -1 })
      .lean()
      .exec();
    return docs.map((doc) => this.toEntity(doc));
  }

  async updateChunkCount(
    {
      id,
      userId,
      chunkCount,
    }: {
      id: string;
      userId: string;
      chunkCount: number;
    },
    tx?: TxContext,
  ): Promise<KnowledgeDocument | undefined> {
    const doc = await this.model
      .findOneAndUpdate(
        { _id: id, userId },
        { chunkCount },
        { new: true, session: tx as ClientSession | undefined },
      )
      .lean()
      .exec();
    return doc ? this.toEntity(doc) : undefined;
  }

  async deleteForUser(
    {
      id,
      userId,
    }: {
      id: string;
      userId: string;
    },
    tx?: TxContext,
  ): Promise<boolean> {
    const result = await this.model
      .deleteOne({ _id: id, userId }, { session: tx as ClientSession | undefined })
      .exec();
    return result.deletedCount === 1;
  }

  private toEntity(doc: KnowledgeDocumentDoc): KnowledgeDocument {
    return {
      id: doc._id,
      userId: doc.userId,
      fileName: doc.fileName,
      contentType: doc.contentType,
      contentHash: doc.contentHash,
      status: doc.status,
      chunkCount: doc.chunkCount,
      createdAt: doc.createdAt.toISOString(),
    };
  }
}
