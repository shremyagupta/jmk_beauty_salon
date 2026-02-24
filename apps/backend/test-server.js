// Simple test server that also verifies the MongoDB connection
const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('Missing MONGODB_URI. Check your .env file in apps/backend.');
  process.exit(1);
}

const app = express();

app.get('/test', (req, res) => {
  res.json({
    message: 'Server and database are reachable',
    timestamp: new Date(),
    dbState: mongoose.connection.readyState
  });
});

async function start() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000
    });
    console.log('MongoDB connection established.');

    app.listen(PORT, () => {
      console.log(`Test server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Server test failed:', error.message);
    process.exit(1);
  }
}

start();
