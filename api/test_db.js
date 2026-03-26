const mongoose = require('mongoose');
async function test() {
  try {
    const uri = process.argv[2] || 'mongodb://localhost:27017/test';
    console.log(`Connecting to ${uri}...`);
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 2000 });
    console.log('Connected!');
    await mongoose.disconnect();
  } catch (err) {
    console.error('Failed:', err.message);
  }
}
test();
