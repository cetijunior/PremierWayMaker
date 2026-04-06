const mongoose = require('mongoose');
const env = require('./env');

let cachedConnection = null;

async function connectDB() {
  if (cachedConnection) return cachedConnection;

  try {
    cachedConnection = await mongoose.connect(env.MONGODB_URI);
    console.log('MongoDB connected');
    return cachedConnection;
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    throw err;
  }
}

module.exports = connectDB;
