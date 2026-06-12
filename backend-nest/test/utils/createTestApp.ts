import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../../src/app.module';
import { AllExceptionsFilter } from '../../src/common/filters/all-exceptions.filter';
import { LoggingInterceptor } from '../../src/common/interceptors/logging.interceptor';

// Boots a fresh app with the same global wiring as main.ts so e2e behavior
// (validation, error envelope) matches production. A new instance per call
// resets the @Global in-memory store seeded in onModuleInit.
export async function createTestApp(): Promise<INestApplication> {
  // Guarantee a signing secret in CI where no local .env exists.
  process.env.JWT_SECRET ??= 'test-secret';
  const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
  const app = moduleRef.createNestApplication();
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalInterceptors(new LoggingInterceptor());
  await app.init();
  return app;
}

// Logs in via the real endpoint and returns the JWT for protected routes.
export async function login(
  app: INestApplication,
  email: string,
  password: string,
): Promise<string> {
  const res = await request(app.getHttpServer())
    .post('/auth/login')
    .send({ email, password });
  return res.body.token as string;
}
