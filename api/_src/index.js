const env = require('./config/env');
const connectDB = require('./config/db');
const createApp = require('./app');

async function start() {
  try {
    await connectDB();
    const app = createApp();
    app.listen(env.PORT, () => {
      console.log(`Server running on port ${env.PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

start();
