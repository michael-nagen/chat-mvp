import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { MongoMemoryReplSet } from 'mongodb-memory-server';
import { AllExceptionsFilter } from '../src/common/filters/all-exceptions.filter';
import { LoggingInterceptor } from '../src/common/interceptors/logging.interceptor';

interface MessageDto {
  id: string;
  content: string;
}
interface ConversationDto {
  id: string;
  lastMessage: string;
}
interface Page {
  messages: MessageDto[];
  nextCursor: string | null;
}

// Exercises the mongo driver against a real single-node replica set (required
// for transactions). Overrides the suite's default memory driver before the app
// is dynamically imported.
describe('Mongo driver (e2e)', () => {
  let replset: MongoMemoryReplSet;
  let app: INestApplication;

  async function buildApp(): Promise<INestApplication> {
    const { AppModule } = await import('../src/app.module');
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    const created = moduleRef.createNestApplication();
    created.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    created.useGlobalFilters(new AllExceptionsFilter());
    created.useGlobalInterceptors(new LoggingInterceptor());
    await created.init();
    return created;
  }

  async function login(): Promise<string> {
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'alice@example.com', password: 'password' });
    return res.body.token as string;
  }

  beforeAll(async () => {
    replset = await MongoMemoryReplSet.create({ replSet: { count: 1 } });
    process.env.STORAGE_DRIVER = 'mongo';
    process.env.MONGO_URI = replset.getUri();
    process.env.JWT_SECRET = 'test-secret';
    const { seed } = await import('../src/scripts/seed');
    await seed();
    app = await buildApp();
  });

  afterAll(async () => {
    await app?.close();
    await replset?.stop();
  });

  it('cursor-paginates a 100+ message thread with no gaps or duplicates', async () => {
    const token = await login();
    const seen: string[] = [];
    let cursor: string | undefined;

    for (let guard = 0; guard < 50; guard++) {
      const res = await request(app.getHttpServer())
        .get('/conversations/c3/messages')
        .query(cursor ? { limit: 50, cursor } : { limit: 50 })
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);
      const page = res.body as Page;
      seen.push(...page.messages.map((m) => m.id));
      if (!page.nextCursor) break;
      cursor = page.nextCursor;
    }

    expect(seen.length).toBe(120);
    expect(new Set(seen).size).toBe(120); // no duplicates
    expect(seen).toEqual([...seen].sort()); // ids are zero-padded → chronological
  });

  it('atomically writes the message and bumps the conversation preview', async () => {
    const token = await login();

    const send = await request(app.getHttpServer())
      .post('/conversations/c2/messages')
      .set('Authorization', `Bearer ${token}`)
      .send({ content: 'tx test' });
    expect(send.status).toBe(201);

    const list = await request(app.getHttpServer())
      .get('/conversations')
      .set('Authorization', `Bearer ${token}`);
    const conversations = list.body.conversations as ConversationDto[];
    const c2 = conversations.find((c) => c.id === 'c2');
    expect(c2?.lastMessage).toBe('tx test');
    // The just-updated conversation sorts first by last activity.
    expect(conversations[0].id).toBe('c2');
  });

  it('persists data across an app restart', async () => {
    const token = await login();
    await request(app.getHttpServer())
      .post('/conversations/c1/messages')
      .set('Authorization', `Bearer ${token}`)
      .send({ content: 'persist me' });

    await app.close();
    app = await buildApp(); // same database, fresh app instance

    const token2 = await login();
    const res = await request(app.getHttpServer())
      .get('/conversations/c1/messages')
      .query({ limit: 100 })
      .set('Authorization', `Bearer ${token2}`);
    const page = res.body as Page;
    expect(page.messages.map((m) => m.content)).toContain('persist me');
  });
});
