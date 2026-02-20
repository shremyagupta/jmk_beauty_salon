// Simple test to isolate the issue
console.log('Starting server test...');

try {
  const express = require('express');
  const mongoose = require('mongoose');
  
  const app = express();
  
  // Test basic route
  app.get('/test', (req, res) => {
    res.json({ message: 'Server is working!', timestamp: new Date() });
  });
  
  const PORT = process.env.PORT || 5000;
  
  app.listen(PORT, () => {
    console.log(`Test server running on port ${PORT}`);
  });
  
} catch (error) {
  console.error('Server test failed:', error);
}
