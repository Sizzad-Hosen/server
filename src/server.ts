import { Server } from 'http';
import app from './app';
import mongoose from 'mongoose';
import config from './app/config';


let server: Server;

async function main() {
  try {
    await mongoose.connect(config.database_url as string);
    console.log('✅ DB URL:', config.database_url);

    console.log('✅ Database Connection Successfully....');

    server = app.listen(config.port || 5000, () => {
      console.log(`🚀 Server running on port ${config.port || 5000}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
  }
}

main();

// Error handling
process.on('unhandledRejection', reason => {
  console.error('😈 Unhandled Rejection:', reason);
  process.exit(1);
});

process.on('uncaughtException', () => {
  console.log('😈 uncaughtException detected, shutting down...');
  process.exit(1);
});
