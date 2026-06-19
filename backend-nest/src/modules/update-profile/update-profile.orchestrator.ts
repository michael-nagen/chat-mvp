import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { toUserResponse } from '../user/user.mapper';
import { NotFoundException } from '../../common/errors/app.exception';
import type { UpdateProfileInput, UpdateProfileOutput } from './update-profile.module';

@Injectable()
export class UpdateProfileOrchestrator {
  constructor(private readonly users: UserService) {}

  async run({
    userId,
    firstName,
    lastName,
  }: UpdateProfileInput): Promise<UpdateProfileOutput> {
    const updated = await this.users.updateName({ userId, firstName, lastName });
    if (!updated) {
      throw new NotFoundException('User not found.');
    }
    return toUserResponse(updated);
  }
}
