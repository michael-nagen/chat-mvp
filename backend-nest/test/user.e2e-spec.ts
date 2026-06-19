import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { createTestApp, login } from './utils/createTestApp';
import { AvatarStorage } from '../src/modules/avatar/avatar.storage';
import { FakeAvatarStorage } from '../src/modules/avatar/avatar.fake';

describe('Me (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    app = await createTestApp();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('GET /me', () => {
    it('requires a token', async () => {
      const res = await request(app.getHttpServer()).get('/me');
      expect(res.status).toBe(401);
    });

    it('returns the authenticated user without the password', async () => {
      const token = await login(app, 'alice@example.com', 'password');
      const res = await request(app.getHttpServer())
        .get('/me')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        id: 'u1',
        email: 'alice@example.com',
        firstName: 'Alice',
        lastName: 'Anderson',
        displayName: 'Alice Anderson',
        avatarUrl: null,
      });
      expect(res.body.password).toBeUndefined();
    });
  });

  describe('PATCH /me/name', () => {
    it('requires a token', async () => {
      const res = await request(app.getHttpServer())
        .patch('/me/name')
        .send({ firstName: 'New', lastName: 'Name' });
      expect(res.status).toBe(401);
    });

    it('updates the name and reflects it on /me', async () => {
      const token = await login(app, 'alice@example.com', 'password');
      const res = await request(app.getHttpServer())
        .patch('/me/name')
        .set('Authorization', `Bearer ${token}`)
        .send({ firstName: 'Alicia', lastName: 'Keys' });

      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        id: 'u1',
        email: 'alice@example.com',
        firstName: 'Alicia',
        lastName: 'Keys',
        displayName: 'Alicia Keys',
        avatarUrl: null,
      });

      const me = await request(app.getHttpServer())
        .get('/me')
        .set('Authorization', `Bearer ${token}`);
      expect(me.body.displayName).toBe('Alicia Keys');
    });

    it('rejects an empty firstName with 400 VALIDATION_ERROR', async () => {
      const token = await login(app, 'alice@example.com', 'password');
      const res = await request(app.getHttpServer())
        .patch('/me/name')
        .set('Authorization', `Bearer ${token}`)
        .send({ firstName: '', lastName: 'Keys' });

      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });
  });

  describe('PATCH /me/email', () => {
    it('updates the email', async () => {
      const token = await login(app, 'alice@example.com', 'password');
      const res = await request(app.getHttpServer())
        .patch('/me/email')
        .set('Authorization', `Bearer ${token}`)
        .send({ email: 'alice.new@example.com' });

      expect(res.status).toBe(200);
      expect(res.body.email).toBe('alice.new@example.com');
    });

    it('allows re-saving the same email (no false conflict)', async () => {
      const token = await login(app, 'alice@example.com', 'password');
      const res = await request(app.getHttpServer())
        .patch('/me/email')
        .set('Authorization', `Bearer ${token}`)
        .send({ email: 'alice@example.com' });

      expect(res.status).toBe(200);
      expect(res.body.email).toBe('alice@example.com');
    });

    it("rejects another user's email with 409 CONFLICT", async () => {
      const token = await login(app, 'alice@example.com', 'password');
      const res = await request(app.getHttpServer())
        .patch('/me/email')
        .set('Authorization', `Bearer ${token}`)
        .send({ email: 'bob@example.com' });

      expect(res.status).toBe(409);
      expect(res.body.error.code).toBe('CONFLICT');
    });

    it('rejects an invalid email with 400 VALIDATION_ERROR', async () => {
      const token = await login(app, 'alice@example.com', 'password');
      const res = await request(app.getHttpServer())
        .patch('/me/email')
        .set('Authorization', `Bearer ${token}`)
        .send({ email: 'not-an-email' });

      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });
  });

  describe('avatar lifecycle', () => {
    it('requires a token to presign', async () => {
      const res = await request(app.getHttpServer())
        .post('/me/avatar/presign')
        .send({ contentType: 'image/png' });
      expect(res.status).toBe(401);
    });

    it('rejects an unsupported content type with 400 VALIDATION_ERROR', async () => {
      const token = await login(app, 'alice@example.com', 'password');
      const res = await request(app.getHttpServer())
        .post('/me/avatar/presign')
        .set('Authorization', `Bearer ${token}`)
        .send({ contentType: 'application/pdf' });

      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('presigns an upload under the caller’s own prefix', async () => {
      const token = await login(app, 'alice@example.com', 'password');
      const res = await request(app.getHttpServer())
        .post('/me/avatar/presign')
        .set('Authorization', `Bearer ${token}`)
        .send({ contentType: 'image/png' });

      expect(res.status).toBe(201);
      expect(res.body.key).toMatch(/^avatars\/u1\//);
      expect(typeof res.body.uploadUrl).toBe('string');
      expect(typeof res.body.publicUrl).toBe('string');
    });

    it('commits an avatar and exposes it on /me', async () => {
      const token = await login(app, 'alice@example.com', 'password');
      const presign = await request(app.getHttpServer())
        .post('/me/avatar/presign')
        .set('Authorization', `Bearer ${token}`)
        .send({ contentType: 'image/png' });

      const res = await request(app.getHttpServer())
        .put('/me/avatar')
        .set('Authorization', `Bearer ${token}`)
        .send({ key: presign.body.key });

      expect(res.status).toBe(200);
      expect(res.body.avatarUrl).toBe(presign.body.publicUrl);

      const me = await request(app.getHttpServer())
        .get('/me')
        .set('Authorization', `Bearer ${token}`);
      expect(me.body.avatarUrl).toBe(presign.body.publicUrl);
    });

    it("rejects committing a key under another user's prefix with 403 FORBIDDEN", async () => {
      const token = await login(app, 'alice@example.com', 'password');
      const res = await request(app.getHttpServer())
        .put('/me/avatar')
        .set('Authorization', `Bearer ${token}`)
        .send({ key: 'avatars/u2/someone-elses.png' });

      expect(res.status).toBe(403);
      expect(res.body.error.code).toBe('FORBIDDEN');
    });

    it('rejects committing a key that was never uploaded with 400 VALIDATION_ERROR', async () => {
      const token = await login(app, 'alice@example.com', 'password');
      const res = await request(app.getHttpServer())
        .put('/me/avatar')
        .set('Authorization', `Bearer ${token}`)
        .send({ key: 'avatars/u1/never-uploaded.png' });

      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('rejects an oversized avatar with 400 and deletes the object', async () => {
      const token = await login(app, 'alice@example.com', 'password');
      const storage = app.get<FakeAvatarStorage>(AvatarStorage);

      const presign = await request(app.getHttpServer())
        .post('/me/avatar/presign')
        .set('Authorization', `Bearer ${token}`)
        .send({ contentType: 'image/png' });
      storage.setObjectSize(presign.body.key, 6 * 1024 * 1024); // over the 5 MB limit

      const res = await request(app.getHttpServer())
        .put('/me/avatar')
        .set('Authorization', `Bearer ${token}`)
        .send({ key: presign.body.key });

      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
      expect(storage.deletedKeys).toContain(presign.body.key);
    });

    it('deletes the previous object when replacing the avatar', async () => {
      const token = await login(app, 'alice@example.com', 'password');
      const storage = app.get<FakeAvatarStorage>(AvatarStorage);

      const first = await request(app.getHttpServer())
        .post('/me/avatar/presign')
        .set('Authorization', `Bearer ${token}`)
        .send({ contentType: 'image/png' });
      await request(app.getHttpServer())
        .put('/me/avatar')
        .set('Authorization', `Bearer ${token}`)
        .send({ key: first.body.key });

      const second = await request(app.getHttpServer())
        .post('/me/avatar/presign')
        .set('Authorization', `Bearer ${token}`)
        .send({ contentType: 'image/jpeg' });
      await request(app.getHttpServer())
        .put('/me/avatar')
        .set('Authorization', `Bearer ${token}`)
        .send({ key: second.body.key });

      expect(storage.deletedKeys).toContain(first.body.key);
    });

    it('removes the avatar, reverts to the default, and deletes the object', async () => {
      const token = await login(app, 'alice@example.com', 'password');
      const storage = app.get<FakeAvatarStorage>(AvatarStorage);

      const presign = await request(app.getHttpServer())
        .post('/me/avatar/presign')
        .set('Authorization', `Bearer ${token}`)
        .send({ contentType: 'image/png' });
      await request(app.getHttpServer())
        .put('/me/avatar')
        .set('Authorization', `Bearer ${token}`)
        .send({ key: presign.body.key });

      const res = await request(app.getHttpServer())
        .delete('/me/avatar')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      // Removal reverts to the in-DB default avatar rather than clearing it.
      expect(res.body.avatarUrl).toContain('data:image/svg+xml');
      expect(storage.deletedKeys).toContain(presign.body.key);
    });
  });
});
