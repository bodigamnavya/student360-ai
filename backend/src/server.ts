import app from './app';
import { connectDatabase } from './config/database';
import { ENV } from './config/env';
import { User } from './models/User';
import { runSeed } from './seeds/seed';

const startServer = async () => {
  try {
    console.log('Starting Student360 AI Backend Server...');
    await connectDatabase();

    // Check if initial seed is needed (e.g. if User collection is empty)
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('No user records detected in database. Automatically running initial seed data...');
      await runSeed();
    }

    const port = parseInt(ENV.PORT, 10) || 5000;
    app.listen(port, () => {
      console.log('====================================================');
      console.log(`🚀 Student360 AI Backend API running on port ${port}`);
      console.log(`📡 Base URL: http://localhost:${port}/api`);
      console.log(`🩺 Health Check: http://localhost:${port}/api/health`);
      console.log(`🌍 Environment: ${ENV.NODE_ENV}`);
      console.log('====================================================');
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
