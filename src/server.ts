import { Server } from 'http';
import app from './app';
import mongoose from 'mongoose';
import config from './app/config';

let server: Server;
let isConnected = false;

async function main() {
  try {
    if (!isConnected) {
      await mongoose.connect(config.database_url as string, {
        serverSelectionTimeoutMS: 20000,
      });
      isConnected = true;
      console.log('✅ MongoDB connected');
    }

    server = app.listen(config.port || 5000, () => {
      console.log(`🚀 Server running on port ${config.port || 5000}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

main();

process.on('unhandledRejection', (reason) => {
  console.error('😈 Unhandled Rejection:', reason);
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  console.error('😈 Uncaught Exception detected:', error);
  process.exit(1);
});
