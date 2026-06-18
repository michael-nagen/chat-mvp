// Runs before any module is imported. The per-entity storage driver is read at
// module-definition time, so the default driver for the suite must be set here.
// The dedicated mongo e2e overrides this in its own beforeAll (before it
// dynamically imports the app).
process.env.STORAGE_DRIVER = process.env.STORAGE_DRIVER ?? 'memory';
process.env.JWT_SECRET = process.env.JWT_SECRET ?? 'test-secret';
