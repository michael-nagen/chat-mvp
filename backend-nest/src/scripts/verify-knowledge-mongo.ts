import 'dotenv/config';
import mongoose from 'mongoose';

// Local-only smoke test for the Knowledge Mongo connection: connects with the
// same URI resolution the app uses (KNOWLEDGE_MONGO_URI, falling back to
// MONGO_URI), then round-trips a throwaway document so you can confirm writes
// land in the expected Atlas database. Run:
//   npm run verify:knowledge-mongo
// It never prints the URI or credentials — only the resolved database name.
const TEMP_COLLECTION = '__knowledge_connection_check';

async function main(): Promise<void> {
  const uri = process.env.KNOWLEDGE_MONGO_URI ?? process.env.MONGO_URI;
  if (!uri) {
    throw new Error('Neither KNOWLEDGE_MONGO_URI nor MONGO_URI is set.');
  }
  const source = process.env.KNOWLEDGE_MONGO_URI
    ? 'KNOWLEDGE_MONGO_URI'
    : 'MONGO_URI (fallback)';

  const connection = await mongoose.createConnection(uri).asPromise();
  try {
    console.log(`Connected using ${source}`);
    console.log(`Database: ${connection.name}`);

    const collection = connection.collection(TEMP_COLLECTION);
    const marker = { check: 'knowledge-connection', createdAt: new Date() };
    const { insertedId } = await collection.insertOne(marker);
    const readBack = await collection.findOne({ _id: insertedId });
    if (!readBack) {
      throw new Error('Inserted document could not be read back.');
    }
    console.log('Write + read round-trip OK.');

    await collection.deleteOne({ _id: insertedId });
    await collection.drop().catch(() => undefined);
    console.log('Cleaned up temporary collection.');
  } finally {
    await connection.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
