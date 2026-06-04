import { z } from 'zod';

export const loginSchema = z.object({
  name: z.string().min(1, 'name is required.'),
});

export type LoginBody = z.infer<typeof loginSchema>;
