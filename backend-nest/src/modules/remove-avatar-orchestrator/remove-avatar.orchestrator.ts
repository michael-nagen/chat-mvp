import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { toUserResponse } from '../user/user.mapper';
import { AvatarService } from '../avatar/avatar.service';
import { NotFoundException } from '../../common/errors/app.exception';
import type { RemoveAvatarInput, RemoveAvatarOutput } from './remove-avatar.module';

@Injectable()
export class RemoveAvatarOrchestrator {
  constructor(
    private readonly users: UserService,
    private readonly avatars: AvatarService,
  ) {}

  async execute({ userId }: RemoveAvatarInput): Promise<RemoveAvatarOutput> {
    const current = await this.users.findById(userId);
    if (!current) {
      throw new NotFoundException('User not found.');
    }

    const updated = await this.users.resetAvatarToDefault({ userId });
    if (!updated) {
      throw new NotFoundException('User not found.');
    }

    // Best-effort cleanup of the removed object; never fails the request.
    if (current.avatarKey) {
      await this.avatars.deleteObject(current.avatarKey).catch(() => undefined);
    }

    return toUserResponse(updated);
  }
}
