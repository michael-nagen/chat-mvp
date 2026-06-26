import { z } from 'zod';
import { evalCaseSchema, evalFileSchema, judgmentSchema } from './eval.schema';

export type EvalCase = z.infer<typeof evalCaseSchema>;
export type EvalFile = z.infer<typeof evalFileSchema>;
export type Judgment = z.infer<typeof judgmentSchema>;
