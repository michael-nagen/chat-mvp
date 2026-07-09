import 'reflect-metadata';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import {
  RAG_RETRIEVAL_PROVIDER_ENV,
  RAG_TUTOR_PROVIDER_ENV,
  resolveRagRetrievalProvider,
  resolveRagTutorProvider,
} from './modules/rag-tutor/config/rag-tutor.constants';
import {
  EMBEDDINGS_PROVIDER_ENV,
  resolveEmbeddingsProvider,
} from './modules/embeddings/embeddings.constants';

// One place that prints which RAG providers are actually live (no secrets), so
// "mock" or "Knowledge Mongo configured: no" in dev is obvious at a glance.
function logProviderConfig(config: ConfigService): void {
  const logger = new Logger('Providers');
  logger.log(
    `RAG retrieval provider: ${resolveRagRetrievalProvider(config.get(RAG_RETRIEVAL_PROVIDER_ENV))}`,
  );
  logger.log(
    `RAG tutor generator: ${resolveRagTutorProvider(config.get(RAG_TUTOR_PROVIDER_ENV))}`,
  );
  logger.log(
    `Embeddings provider: ${resolveEmbeddingsProvider(config.get(EMBEDDINGS_PROVIDER_ENV))}`,
  );
  logger.log(
    `Knowledge Mongo configured: ${config.get('KNOWLEDGE_MONGO_URI') ? 'yes' : 'no'}`,
  );
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: false });

  // Allowlist the frontend origin(s). Override via CORS_ORIGIN (comma-separated).
  const allowedOrigins = (process.env.CORS_ORIGIN ?? 'http://localhost:5173')
    .split(',')
    .map((origin) => origin.trim());
  app.enableCors({ origin: allowedOrigins });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalInterceptors(new LoggingInterceptor());

  // Finish in-flight requests before exiting when the platform stops the process.
  app.enableShutdownHooks();

  logProviderConfig(app.get(ConfigService));

  const port = Number(process.env.PORT) || 3000;
  await app.listen(port);
  console.log(`Server listening on port ${port}`);
}

bootstrap();
