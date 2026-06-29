import { randomUUID } from 'crypto';
import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { UserSummarySource } from './user.types';
import { DEFAULT_AVATAR_URL } from './user.constants';
import { User } from '../../common/storage/entities';
import { ConflictException } from '../../common/errors/app.exception';

@Injectable()
export class UserService {
  constructor(private readonly repo: UserRepository) {}

  // Caller hashes the password; the service only ever stores a hash.
  async create({
    email,
    firstName,
    lastName,
    passwordHash,
  }: {
    email: string;
    firstName: string;
    lastName: string;
    passwordHash: string;
  }): Promise<User> {
    if (await this.repo.findByEmail(email)) {
      throw new ConflictException('Email is already registered.');
    }
    const user: User = {
      id: `u-${randomUUID()}`,
      email,
      firstName,
      lastName,
      passwordHash,
      // New users start with no contacts; contacts are populated elsewhere.
      contactIds: [],
      // New users start with an in-DB default avatar (no S3 object → no key).
      avatarUrl: DEFAULT_AVATAR_URL,
      avatarKey: null,
    };
    return this.repo.create(user);
  }

  updateName({
    userId,
    firstName,
    lastName,
  }: {
    userId: string;
    firstName: string;
    lastName: string;
  }): Promise<User | undefined> {
    return this.repo.update(userId, { firstName, lastName });
  }

  async updateEmail({
    userId,
    email,
  }: {
    userId: string;
    email: string;
  }): Promise<User | undefined> {
    const owner = await this.repo.findByEmail(email);
    if (owner && owner.id !== userId) {
      throw new ConflictException('Email is already registered.');
    }
    return this.repo.update(userId, { email });
  }

  setAvatar({
    userId,
    avatarUrl,
    avatarKey,
  }: {
    userId: string;
    avatarUrl: string;
    avatarKey: string;
  }): Promise<User | undefined> {
    return this.repo.update(userId, { avatarUrl, avatarKey });
  }

  // Removing a custom avatar reverts to the in-DB default (not empty); the S3
  // key is cleared because the default has no S3 object.
  resetAvatarToDefault({ userId }: { userId: string }): Promise<User | undefined> {
    return this.repo.update(userId, {
      avatarUrl: DEFAULT_AVATAR_URL,
      avatarKey: null,
    });
  }

  findById(id: string): Promise<User | undefined> {
    return this.repo.findById(id);
  }

  // The ids this user may converse with. Empty when the user is unknown.
  async getContactIds(userId: string): Promise<string[]> {
    const user = await this.repo.findById(userId);
    return user?.contactIds ?? [];
  }

  findByIds(ids: string[]): Promise<UserSummarySource[]> {
    return this.repo.findByIds(ids);
  }

  // Full entity (incl. password hash) for internal auth use — never sent on the wire.
  findByEmail(email: string): Promise<User | undefined> {
    return this.repo.findByEmail(email);
  }
}
