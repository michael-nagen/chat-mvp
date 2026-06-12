import { z } from 'zod';

export const createMessageSchema = z.object({
  content: z.string().min(1, 'content is required.'),
});

export type CreateMessageBody = z.infer<typeof createMessageSchema>;

// `limit` capped so a caller can't request the whole table.
export const listMessagesQuerySchema = z.object({
  cursor: z.string().min(1).optional(),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

export type ListMessagesQuery = z.infer<typeof listMessagesQuerySchema>;
