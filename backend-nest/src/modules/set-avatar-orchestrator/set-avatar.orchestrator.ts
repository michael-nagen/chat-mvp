import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { toUserResponse } from '../user/user.mapper';
import { AvatarService } from '../avatar/avatar.service';
import { avatarKeyPrefix } from '../avatar/avatar.constants';
import {
  ForbiddenException,
  NotFoundException,
} from '../../common/errors/app.exception';
import type { SetAvatarInput, SetAvatarOutput } from './set-avatar.module';

@Injectable()
export class SetAvatarOrchestrator {
  constructor(
    private readonly users: UserService,
    private readonly avatars: AvatarService,
  ) {}

  async execute({ userId, key }: SetAvatarInput): Promise<SetAvatarOutput> {
    // A user may only commit an object under their own prefix.
    if (!key.startsWith(avatarKeyPrefix(userId))) {
      throw new ForbiddenException('Cannot set an avatar you do not own.');
    }

    // Authoritative: confirm the object exists and is within the size limit.
    await this.avatars.assertUploaded(key);

    const current = await this.users.findById(userId);
    if (!current) {
      throw new NotFoundException('User not found.');
    }

    const updated = await this.users.setAvatar({
      userId,
      avatarUrl: this.avatars.buildPublicUrl(key),
      avatarKey: key,
    });
    if (!updated) {
      throw new NotFoundException('User not found.');
    }

    // Best-effort cleanup of the replaced object; never fails the request.
    const previousKey = current.avatarKey;
    if (previousKey && previousKey !== key) {
      await this.avatars.deleteObject(previousKey).catch(() => undefined);
    }

    return toUserResponse(updated);
  }
}
