// Runs before any module is imported. The per-entity storage driver is read at
// module-definition time, so the default driver for the suite must be set here.
// The dedicated mongo e2e overrides this in its own beforeAll (before it
// dynamically imports the app).
process.env.STORAGE_DRIVER = process.env.STORAGE_DRIVER ?? 'memory';
process.env.JWT_SECRET = process.env.JWT_SECRET ?? 'test-secret';
// Avatar storage uses the in-memory fake in tests so no suite touches AWS S3
// (this includes the mongo e2e, which only overrides STORAGE_DRIVER).
process.env.AVATAR_STORAGE = process.env.AVATAR_STORAGE ?? 'fake';
// Embeddings use the deterministic fake in tests so no suite calls OpenAI and
// retrieval stays reproducible.
process.env.EMBEDDINGS_PROVIDER = process.env.EMBEDDINGS_PROVIDER ?? 'fake';
// The RAG tutor uses the deterministic fake generator in tests so tutor message
// flows never call OpenAI.
process.env.RAG_TUTOR_PROVIDER = process.env.RAG_TUTOR_PROVIDER ?? 'fake';
// Retrieval stays on the offline mock in tests so nothing hits Atlas, even if a
// local .env sets RAG_RETRIEVAL_PROVIDER=atlas (set before .env is loaded).
process.env.RAG_RETRIEVAL_PROVIDER = process.env.RAG_RETRIEVAL_PROVIDER ?? 'mock';
