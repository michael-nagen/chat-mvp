import 'reflect-metadata';
import 'dotenv/config';
import * as bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import { SALT_ROUNDS } from '../modules/auth/auth.constants';
import { UserDoc, UserSchema } from '../modules/user/storage/user.schema';
import {
  ConversationDoc,
  ConversationSchema,
} from '../modules/conversations/storage/conversations.schema';
import { MessageDoc, MessageSchema } from '../modules/messages/storage/messages.schema';

// Standalone, idempotent seed. Upserts fixtures by stable _id, so re-running
// never duplicates and never wipes real data. Not run on boot (data must
// survive restarts); run explicitly with `npm run seed`.

const BIG_THREAD_ID = 'c3';
const BIG_THREAD_SIZE = 120; // exceeds the 100+ pagination requirement

export async function seed(): Promise<void> {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    throw new Error('MONGO_URI is required to seed.');
  }
  await mongoose.connect(uri);

  const User = mongoose.model(UserDoc.name, UserSchema);
  const Conversation = mongoose.model(ConversationDoc.name, ConversationSchema);
  const Message = mongoose.model(MessageDoc.name, MessageSchema);

  const passwordHash = await bcrypt.hash('password', SALT_ROUNDS);
  const epoch = new Date('2026-06-04T08:00:00.000Z').getTime();
  const at = (minutes: number): Date => new Date(epoch + minutes * 60_000);

  const users = [
    { _id: 'u1', email: 'alice@example.com', firstName: 'Alice', lastName: 'Anderson', passwordHash, createdAt: at(0) },
    { _id: 'u2', email: 'bob@example.com', firstName: 'Bob', lastName: 'Brown', passwordHash, createdAt: at(0) },
    { _id: 'u3', email: 'carol@example.com', firstName: 'Carol', lastName: 'Carter', passwordHash, createdAt: at(0) },
    { _id: 'u4', email: 'dave@example.com', firstName: 'Dave', lastName: 'Davis', passwordHash, createdAt: at(0) },
    { _id: 'u5', email: 'eve@example.com', firstName: 'Eve', lastName: 'Evans', passwordHash, createdAt: at(0) },
    { _id: 'u6', email: 'frank@example.com', firstName: 'Frank', lastName: 'Foster', passwordHash, createdAt: at(0) },
    { _id: 'u7', email: 'grace@example.com', firstName: 'Grace', lastName: 'Green', passwordHash, createdAt: at(0) },
    { _id: 'u8', email: 'heidi@example.com', firstName: 'Heidi', lastName: 'Hughes', passwordHash, createdAt: at(0) },
  ];

  // Everyone after Alice & Bob gets a starter DM with Alice so they are usable
  // immediately (log in as that user, or as Alice to see them all).
  const extraUserIds = ['u3', 'u4', 'u5', 'u6', 'u7', 'u8'];

  const messages = [
    { _id: 'm1', conversationId: 'c1', senderId: 'u1', content: 'Hey Bob!', createdAt: at(0) },
    { _id: 'm2', conversationId: 'c1', senderId: 'u2', content: 'Hey Alice, how are you?', createdAt: at(15) },
    { _id: 'm3', conversationId: 'c1', senderId: 'u1', content: 'See you tomorrow!', createdAt: at(30) },
  ];

  // A 100+ message thread (c3) to exercise cursor pagination.
  for (let i = 1; i <= BIG_THREAD_SIZE; i++) {
    messages.push({
      _id: `m3-${String(i).padStart(3, '0')}`,
      conversationId: BIG_THREAD_ID,
      senderId: i % 2 === 0 ? 'u2' : 'u1',
      content: `Seed message ${i}`,
      createdAt: at(100 + i),
    });
  }

  const lastBig = messages[messages.length - 1];
  const conversations = [
    { _id: 'c1', participantIds: ['u1', 'u2'], title: 'Alice & Bob', lastMessage: 'See you tomorrow!', lastMessageAt: at(30), createdAt: at(0) },
    { _id: 'c2', participantIds: ['u1', 'u2'], title: 'Project chat', lastMessage: 'Sounds good.', lastMessageAt: new Date('2026-06-03T17:45:00.000Z'), createdAt: new Date('2026-06-03T17:00:00.000Z') },
    { _id: BIG_THREAD_ID, participantIds: ['u1', 'u2'], title: 'Big thread', lastMessage: lastBig.content, lastMessageAt: lastBig.createdAt, createdAt: at(100) },
  ];

  // A DM between Alice (u1) and each extra user, with one opening message.
  extraUserIds.forEach((uid, i) => {
    const profile = users.find((u) => u._id === uid)!;
    const conversationId = `c-${uid}`;
    const content = `Hi ${profile.firstName}!`;
    const when = at(300 + i);
    conversations.push({
      _id: conversationId,
      participantIds: ['u1', uid],
      title: `Alice & ${profile.firstName}`,
      lastMessage: content,
      lastMessageAt: when,
      createdAt: when,
    });
    messages.push({
      _id: `m-${conversationId}`,
      conversationId,
      senderId: 'u1',
      content,
      createdAt: when,
    });
  });

  await Promise.all(
    users.map((u) => User.updateOne({ _id: u._id }, { $set: u }, { upsert: true })),
  );
  await Promise.all(
    conversations.map((c) => Conversation.updateOne({ _id: c._id }, { $set: c }, { upsert: true })),
  );
  await Promise.all(
    messages.map((m) => Message.updateOne({ _id: m._id }, { $set: m }, { upsert: true })),
  );

  console.log(
    `Seeded ${users.length} users, ${conversations.length} conversations, ${messages.length} messages ` +
      `(thread ${BIG_THREAD_ID} has ${BIG_THREAD_SIZE}).`,
  );
  await mongoose.disconnect();
}

// Run only when invoked directly (npm run seed), not when imported by tests.
if (require.main === module) {
  seed().catch(async (error) => {
    console.error(error);
    await mongoose.disconnect().catch(() => undefined);
    process.exit(1);
  });
}
