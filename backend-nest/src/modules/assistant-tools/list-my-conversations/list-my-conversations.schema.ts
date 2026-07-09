import { z } from 'zod';

export const listMyConversationsInputSchema = z.object({});

export const listMyConversationsOutputSchema = z.object({
  conversations: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      lastMessage: z.string(),
      updatedAt: z.string(),
    }),
  ),
});
