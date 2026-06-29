import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { createTestApp } from './utils/createTestApp';

describe('Auth (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    app = await createTestApp();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('POST /auth/signup', () => {
    it('creates a user and returns a token', async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/signup')
        .send({
          email: 'carol@example.com',
          firstName: 'Carol',
          lastName: 'Carter',
          password: 'secret1',
        });

      expect(res.status).toBe(201);
      expect(res.body.user.email).toBe('carol@example.com');
      expect(res.body.user.firstName).toBe('Carol');
      expect(res.body.user.lastName).toBe('Carter');
      expect(res.body.user.displayName).toBe('Carol Carter');
      // New users start with an in-DB (data URI) default avatar, not an S3 object.
      expect(res.body.user.avatarUrl).toContain('data:image/svg+xml');
      expect(res.body.user.id).toMatch(/^u-/);
      expect(typeof res.body.token).toBe('string');
      expect(res.body.user.password).toBeUndefined();
    });

    it('rejects a missing firstName with 400 VALIDATION_ERROR', async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/signup')
        .send({ email: 'noname@example.com', lastName: 'Nameless', password: 'secret1' });

      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('rejects a duplicate email with 409 CONFLICT', async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/signup')
        .send({
          email: 'alice@example.com',
          firstName: 'Alice',
          lastName: 'Anderson',
          password: 'secret1',
        });

      expect(res.status).toBe(409);
      expect(res.body.error.code).toBe('CONFLICT');
    });

    it('rejects an invalid email with 400 VALIDATION_ERROR', async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/signup')
        .send({ email: 'not-an-email', firstName: 'No', lastName: 'Pe', password: 'secret1' });

      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('rejects a too-short password with 400 VALIDATION_ERROR', async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/signup')
        .send({ email: 'dan@example.com', firstName: 'Dan', lastName: 'Doe', password: '123' });

      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });
  });

  describe('POST /auth/login', () => {
    it('logs in a seeded user', async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'alice@example.com', password: 'password' });

      expect(res.status).toBe(201);
      expect(res.body.user).toEqual({
        id: 'u1',
        email: 'alice@example.com',
        firstName: 'Alice',
        lastName: 'Anderson',
        displayName: 'Alice Anderson',
        avatarUrl: null,
      });
      expect(typeof res.body.token).toBe('string');
    });

    it('rejects a wrong password with 401 UNAUTHORIZED', async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'alice@example.com', password: 'wrong' });

      expect(res.status).toBe(401);
      expect(res.body.error.code).toBe('UNAUTHORIZED');
      expect(res.body.error.message).toBe('Invalid email or password.');
    });

    it('rejects an unknown email with 401 UNAUTHORIZED', async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'ghost@example.com', password: 'password' });

      expect(res.status).toBe(401);
      expect(res.body.error.code).toBe('UNAUTHORIZED');
    });
  });
});
