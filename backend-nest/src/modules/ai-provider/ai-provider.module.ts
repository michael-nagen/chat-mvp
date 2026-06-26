import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LlmProvider } from './llm-provider';
import { OpenAiProvider } from './openai.provider';

@Module({
  providers: [
    {
      provide: LlmProvider,
      inject: [ConfigService],
      useFactory: (config: ConfigService): LlmProvider =>
        new OpenAiProvider(config),
    },
  ],
  exports: [LlmProvider],
})
export class AiProviderModule {}
