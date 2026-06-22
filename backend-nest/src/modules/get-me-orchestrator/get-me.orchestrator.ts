import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { NotFoundException } from '../../common/errors/app.exception';
import { toUserResponse } from '../user/user.mapper';
import type { GetMeInput, GetMeOutput } from './get-me.module';

@Injectable()
export class GetMeOrchestrator {
  constructor(private readonly users: UserService) {}

  async execute({ userId }: GetMeInput): Promise<GetMeOutput> {
    const user = await this.users.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found.');
    }
    return toUserResponse(user);
  }
}
