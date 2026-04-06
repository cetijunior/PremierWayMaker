const connectDB = require('./_src/config/db');
const createApp = require('./_src/app');

let app;

module.exports = async (req, res) => {
  if (!app) {
    await connectDB();
    app = createApp();
  }
  return app(req, res);
};
