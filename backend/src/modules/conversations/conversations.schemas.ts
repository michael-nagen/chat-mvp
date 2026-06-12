import { z } from 'zod';

export const createConversationSchema = z.object({
  title: z.string().min(1, 'title is required.'),
});

export type CreateConversationBody = z.infer<typeof createConversationSchema>;
