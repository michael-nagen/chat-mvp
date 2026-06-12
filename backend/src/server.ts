import { app } from './app';

const PORT = Number(process.env.PORT) || 3000;

const server = app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

// Finish in-flight requests before exiting when the platform stops the process.
const shutdown = (signal: string) => {
  console.log(`${signal} received, shutting down gracefully`);
  server.close(() => process.exit(0));
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
