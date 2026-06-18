import { Message } from '../memory/entities';
import { TxContext } from '../../common/storage/unit-of-work';

// Storage-agnostic port. Each driver (Mongo, in-memory) provides an
// implementation; services depend on this abstract class, never on a driver.
// Implementations over-fetch limit+1 so the service can detect a further page.
export abstract class MessagesRepository {
  // Chronological history, oldest → newest; next page is strictly after the cursor.
  abstract findPage(params: {
    conversationId: string;
    cursor: string | undefined;
    limit: number;
  }): Promise<Message[]>;

  // Content search across the given conversations, newest → oldest.
  abstract matchContent(params: {
    conversationIds: Set<string>;
    needle: string;
    cursor: string | undefined;
    limit: number;
  }): Promise<Message[]>;

  abstract insert(message: Message, tx?: TxContext): Promise<Message>;
}
