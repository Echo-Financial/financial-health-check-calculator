// backend/src/config/db.js
const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI;

if (!MONGO_URI) {
  throw new Error(
    'Missing database connection string. Set MONGO_URI in backend/.env (or MONGODB_URI as a temporary fallback).'
  );
}

async function connectDB() {
  try {
    await mongoose.connect(MONGO_URI, {
      // You can add options here if needed (keep defaults for Mongoose v6+)
    });
    console.log('✅ MongoDB connected');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  }
}

module.exports = { connectDB };
