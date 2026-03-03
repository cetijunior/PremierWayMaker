require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { Admin } = require('./models');

const MONGODB_URI = process.env.MONGODB_URI;
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

if (!MONGODB_URI?.trim()) {
  console.error('MONGODB_URI is required');
  process.exit(1);
}

if (!ADMIN_PASSWORD?.trim()) {
  console.error('ADMIN_PASSWORD is required for seeding');
  process.exit(1);
}

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    const hashed = await bcrypt.hash(ADMIN_PASSWORD, 10);
    await Admin.findOneAndUpdate(
      { username: ADMIN_USERNAME },
      { username: ADMIN_USERNAME, password: hashed },
      { upsert: true, new: true }
    );
    console.log(`Admin user "${ADMIN_USERNAME}" created or updated`);
  } catch (err) {
    console.error('Seed failed:', err);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

seed();
