import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OpenAIEmbeddings } from '@langchain/openai';
import { EmbeddingsProvider } from './embeddings-provider';
import { EMBEDDING_MODEL } from './embeddings.constants';
import { OPENAI_API_KEY_ENV } from '../ai-provider/ai-provider.constants';

// OpenAI text-embedding-3-small via LangChain. The client (and thus the API key
// requirement) is created lazily on first use, so the app boots without a key
// and only ingestion/retrieval actually need it.
@Injectable()
export class OpenAiEmbeddingsProvider extends EmbeddingsProvider {
  private client: OpenAIEmbeddings | undefined;

  constructor(private readonly config: ConfigService) {
    super();
  }

  embedDocuments(texts: string[]): Promise<number[][]> {
    return this.getClient().embedDocuments(texts);
  }

  embedQuery(text: string): Promise<number[]> {
    return this.getClient().embedQuery(text);
  }

  private getClient(): OpenAIEmbeddings {
    if (!this.client) {
      this.client = new OpenAIEmbeddings({
        apiKey: this.config.getOrThrow<string>(OPENAI_API_KEY_ENV),
        model: EMBEDDING_MODEL,
      });
    }
    return this.client;
  }
}
