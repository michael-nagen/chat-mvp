import { z } from 'zod';

export const createMessageSchema = z.object({
  content: z.string().min(1, 'content is required.'),
});

// Query params arrive as strings, so `limit` is coerced to a number. Defaults
// to 20 per the contract; capped so a caller can't request the whole table.
export const listMessagesQuerySchema = z.object({
  cursor: z.string().min(1).optional(),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

export type ListMessagesQuery = z.infer<typeof listMessagesQuerySchema>;
