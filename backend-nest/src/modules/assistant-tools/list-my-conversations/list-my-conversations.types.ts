import { z } from 'zod';
import {
  listMyConversationsInputSchema,
  listMyConversationsOutputSchema,
} from './list-my-conversations.schema';

export type ListMyConversationsInput = z.infer<
  typeof listMyConversationsInputSchema
>;

export type ListMyConversationsOutput = z.infer<
  typeof listMyConversationsOutputSchema
>;
