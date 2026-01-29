// backend/src/config/db.js
const mongoose = require('mongoose');
const logger = require('../logger');

const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI;

if (!MONGO_URI) {
  throw new Error(
    'Missing database connection string. Set MONGO_URI in backend/.env (or MONGODB_URI as a temporary fallback).'
  );
}

function getSafeMongoTarget(uri) {
  try {
    const u = new URL(uri);
    return `${u.protocol}//${u.host}${u.pathname}`;
  } catch (err) {
    return 'invalid-mongo-uri';
  }
}

const DEFAULT_RETRY_DELAY_MS = Number(process.env.MONGO_RETRY_DELAY_MS || 3000);
const DEFAULT_MAX_RETRIES = Number(process.env.MONGO_MAX_RETRIES || 10);
const SAFE_TARGET = getSafeMongoTarget(MONGO_URI);

async function connectDB() {
  let attempt = 0;
  const maxRetries = Number.isFinite(DEFAULT_MAX_RETRIES) ? DEFAULT_MAX_RETRIES : 10;

  while (true) {
    try {
      attempt += 1;
      logger.info({ msg: 'Connecting to MongoDB', target: SAFE_TARGET, attempt });

      await mongoose.connect(MONGO_URI, {
        serverSelectionTimeoutMS: Number(process.env.MONGO_SERVER_SELECTION_TIMEOUT_MS || 10000),
        connectTimeoutMS: Number(process.env.MONGO_CONNECT_TIMEOUT_MS || 10000),
        socketTimeoutMS: Number(process.env.MONGO_SOCKET_TIMEOUT_MS || 45000),
        family: Number(process.env.MONGO_IP_FAMILY || 4),
      });

      logger.info('MongoDB connected');
      return;
    } catch (err) {
      logger.error({ msg: 'MongoDB connection error', attempt, err: err?.message || err });

      if (attempt >= maxRetries) {
        throw err;
      }

      await new Promise((resolve) => setTimeout(resolve, DEFAULT_RETRY_DELAY_MS));
    }
  }
}

module.exports = { connectDB };
