import { z } from 'zod';
import {
  retrieveKnowledgeInputSchema,
  retrieveKnowledgeOutputSchema,
} from './retrieve-knowledge.schema';

export type RetrieveKnowledgeInput = z.infer<
  typeof retrieveKnowledgeInputSchema
>;

export type RetrieveKnowledgeOutput = z.infer<
  typeof retrieveKnowledgeOutputSchema
>;
