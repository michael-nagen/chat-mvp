import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EmbeddingsProvider } from './embeddings-provider';
import { OpenAiEmbeddingsProvider } from './openai-embeddings.provider';
import { FakeEmbeddingsProvider } from './fake-embeddings.provider';
import {
  EMBEDDINGS_PROVIDER_ENV,
  resolveEmbeddingsProvider,
} from './embeddings.constants';

// Picks the embeddings implementation from EMBEDDINGS_PROVIDER: 'fake' for the
// deterministic, credential-free test double; anything else (default) uses the
// real OpenAI provider.
@Module({
  providers: [
    {
      provide: EmbeddingsProvider,
      inject: [ConfigService],
      useFactory: (config: ConfigService): EmbeddingsProvider =>
        resolveEmbeddingsProvider(config.get<string>(EMBEDDINGS_PROVIDER_ENV)) ===
        'fake'
          ? new FakeEmbeddingsProvider()
          : new OpenAiEmbeddingsProvider(config),
    },
  ],
  exports: [EmbeddingsProvider],
})
export class EmbeddingsModule {}
