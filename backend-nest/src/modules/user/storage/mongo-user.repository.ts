import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../../memory/entities';
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

  async findByEmail(email: string): Promise<User | undefined> {
    return this.toEntity(await this.model.findOne({ email }).lean().exec());
  }

  async create(user: User): Promise<User> {
    await this.model.create({
      _id: user.id,
      email: user.email,
      name: user.name,
      passwordHash: user.passwordHash,
      createdAt: new Date(),
    });
    return user;
  }

  private toEntity(doc: UserDoc | null): User | undefined {
    if (!doc) {
      return undefined;
    }
    return {
      id: doc._id,
      email: doc.email,
      name: doc.name,
      passwordHash: doc.passwordHash,
    };
  }
}
