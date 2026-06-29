import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { toUserSummary } from '../user/user.mapper';
import type { GetContactsInput, GetContactsOutput } from './get-contacts.module';

@Injectable()
export class GetContactsOrchestrator {
  constructor(private readonly users: UserService) {}

  async execute({ userId }: GetContactsInput): Promise<GetContactsOutput> {
    const contactIds = await this.users.getContactIds(userId);
    const contacts = await this.users.findByIds(contactIds);
    return contacts.map(toUserSummary);
  }
}
