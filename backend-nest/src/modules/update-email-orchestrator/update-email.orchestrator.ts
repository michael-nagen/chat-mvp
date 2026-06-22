import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { toUserResponse } from '../user/user.mapper';
import { NotFoundException } from '../../common/errors/app.exception';
import type { UpdateEmailInput, UpdateEmailOutput } from './update-email.module';

@Injectable()
export class UpdateEmailOrchestrator {
  constructor(private readonly users: UserService) {}

  async execute({ userId, email }: UpdateEmailInput): Promise<UpdateEmailOutput> {
    const updated = await this.users.updateEmail({ userId, email });
    if (!updated) {
      throw new NotFoundException('User not found.');
    }
    return toUserResponse(updated);
  }
}
