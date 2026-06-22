import { Conversation } from '../../common/storage/entities';
import { TxContext } from '../../common/storage/unit-of-work';

// Storage-agnostic port. Drivers implement it; the service depends on this
// abstract class, never on a concrete driver.
export abstract class ConversationsRepository {
  abstract getForUser(userId: string): Promise<Conversation[]>;
  abstract findByDmKey(dmKey: string): Promise<Conversation | undefined>;
  abstract insert(conversation: Conversation): Promise<Conversation>;
  abstract findById(id: string): Promise<Conversation | undefined>;
  abstract updateLastMessage(
    params: {
      id: string;
      lastMessage: string;
      updatedAt: string;
    },
    tx?: TxContext,
  ): Promise<Conversation | undefined>;
}
