import { Injectable } from '@nestjs/common';
import { encode } from 'gpt-tokenizer/cjs/model/gpt-4o-mini';
import { TokenCounter } from './token-counter';

@Injectable()
export class GptTokenCounter extends TokenCounter {
  count(text: string): number {
    return encode(text).length;
  }
}
