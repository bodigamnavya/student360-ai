import mongoose from 'mongoose';
import { ENV } from './env';

let memoryServer: any = null;

export let dbConnectionInfo = {
  status: 'disconnected',
  type: 'none',
  uri: ''
};

export const connectDatabase = async (): Promise<void> => {
  try {
    if (mongoose.connection.readyState === 1) {
      dbConnectionInfo.status = 'connected';
      return;
    }
    mongoose.set('strictQuery', false);

    if (ENV.MONGODB_URI && ENV.MONGODB_URI.trim() !== '') {
      console.log('Connecting to provided MongoDB URI...');
      try {
        await mongoose.connect(ENV.MONGODB_URI, {
          serverSelectionTimeoutMS: 5000
        });
        console.log('✓ Connected to MongoDB via URI successfully');
        dbConnectionInfo = { status: 'connected', type: 'atlas/custom', uri: ENV.MONGODB_URI.split('@').pop() || 'connected' };
        return;
      } catch (uriError: any) {
        console.warn('⚠️ Could not connect to provided MONGODB_URI (Check IP Whitelist in MongoDB Atlas):', uriError.message);
        console.log('Falling back to embedded MongoDB for uninterrupted local execution...');
      }
    }

    try {
      // Try local standard MongoDB first
      console.log('Attempting connection to local MongoDB daemon (mongodb://127.0.0.1:27017/student360)...');
      await mongoose.connect('mongodb://127.0.0.1:27017/student360', {
        serverSelectionTimeoutMS: 2000
      });
      console.log('✓ Connected to local MongoDB instance');
      dbConnectionInfo = { status: 'connected', type: 'local', uri: 'mongodb://127.0.0.1:27017/student360' };
    } catch (localErr) {
      console.log('Local MongoDB not running. Initializing embedded high-performance in-memory MongoDB...');
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      memoryServer = await MongoMemoryServer.create({
        instance: {
          dbName: 'student360'
        }
      });
      const uri = memoryServer.getUri();
      await mongoose.connect(uri);
      console.log(`✓ Connected to Embedded MongoDB Server: ${uri}`);
      dbConnectionInfo = { status: 'connected', type: 'embedded-in-memory', uri };
    }
  } catch (error) {
    console.error('✗ Failed to connect to MongoDB:', error);
    dbConnectionInfo = { status: 'error', type: 'error', uri: '' };
    process.exit(1);
  }
};

export const disconnectDatabase = async (): Promise<void> => {
  await mongoose.disconnect();
  if (memoryServer) {
    await memoryServer.stop();
  }
};
