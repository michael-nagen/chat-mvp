import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../../../common/storage/entities';
import { UserSummarySource, UserUpdate } from '../user.types';
import { UserRepository } from '../user.repository';
import { UserDoc, UserDocument } from './user.schema';

// Mongo driver for users. Maps documents to the plain domain entity.
@Injectable()
export class MongoUserRepository extends UserRepository {
  constructor(
    @InjectModel(UserDoc.name) private readonly model: Model<UserDocument>,
  ) {
    super();
  }

  async findById(id: string): Promise<User | undefined> {
    return this.toEntity(await this.model.findById(id).lean().exec());
  }

  async findByIds(ids: string[]): Promise<UserSummarySource[]> {
    const docs = await this.model
      .find({ _id: { $in: ids } })
      .select('firstName lastName avatarUrl')
      .lean()
      .exec();
    return docs.map((doc) => ({
      id: doc._id,
      firstName: doc.firstName,
      lastName: doc.lastName,
      avatarUrl: doc.avatarUrl ?? null,
    }));
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.toEntity(await this.model.findOne({ email }).lean().exec());
  }

  async create(user: User): Promise<User> {
    await this.model.create({
      _id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      passwordHash: user.passwordHash,
      contactIds: user.contactIds,
      avatarUrl: user.avatarUrl ?? null,
      avatarKey: user.avatarKey ?? null,
      createdAt: new Date(),
    });
    return user;
  }

  async update(id: string, patch: UserUpdate): Promise<User | undefined> {
    return this.toEntity(
      await this.model
        .findByIdAndUpdate(id, { $set: patch }, { new: true })
        .lean()
        .exec(),
    );
  }

  private toEntity(doc: UserDoc | null): User | undefined {
    if (!doc) {
      return undefined;
    }
    return {
      id: doc._id,
      email: doc.email,
      firstName: doc.firstName,
      lastName: doc.lastName,
      passwordHash: doc.passwordHash,
      contactIds: doc.contactIds ?? [],
      avatarUrl: doc.avatarUrl ?? null,
      avatarKey: doc.avatarKey ?? null,
    };
  }
}
