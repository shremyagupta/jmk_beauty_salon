const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Utility helpers
const parseStaffUsers = (rawUsers) => {
  if (!rawUsers) return [];

  return rawUsers
    .split(',')
    .map(entry => entry.trim())
    .filter(Boolean)
    .map(entry => {
      const [username, password, roleName] = entry.split(':').map(part => part && part.trim());
      return {
        username,
        password,
        role: roleName || 'staff'
      };
    })
    .filter(user => user.username && user.password);
};

const staffUsers = parseStaffUsers(process.env.STAFF_USERS);

// Middleware
const path = require('path');
const compression = require('compression');

// enable gzip/brotli compression for responses
app.use(compression());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static images stored under shared/assets/images
// Use aggressive caching for image assets and allow compression to reduce size
const staticImagesDir = path.join(__dirname, '..', '..', 'shared', 'assets', 'images');
app.use('/images', express.static(staticImagesDir, {
  maxAge: '7d', // cache images for 7 days
  setHeaders: (res, filePath) => {
    // Better caching for immutable image assets
    if (filePath.match(/\.(jpg|jpeg|png|gif|webp|avif|mp4)$/i)) {
      res.setHeader('Cache-Control', 'public, max-age=604800, immutable');
    }
  }
}));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/jmkbeauty', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Connected Successfully'))
.catch(err => console.error('MongoDB Connection Error:', err));

// Simple inline auth routes (admin JWT login)
const authRouter = express.Router();

authRouter.post('/login', (req, res) => {
  const { username, password } = req.body;

  const adminUsername = process.env.ADMIN_USERNAME;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminUsername || !adminPassword) {
    console.warn('Admin credentials not configured on server');
  }

  let role = null;

  if (adminUsername && adminPassword && username === adminUsername && password === adminPassword) {
    role = 'admin';
  } else {
    const staffMatch = staffUsers.find(user => user.username === username && user.password === password);
    if (staffMatch) {
      role = staffMatch.role || 'staff';
    }
  }

  if (!role) {
    return res.status(401).json({ error: 'Invalid username or password' });
  }

  const payload = { username, role };
  const token = jwt.sign(payload, process.env.JWT_SECRET || 'dev-secret', { expiresIn: '7d' });

  res.json({ token, user: payload });
});

authRouter.get('/me', (req, res) => {
  const authHeader = req.headers['authorization'] || req.headers['Authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication token missing' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret');
    res.json({ user: payload });
  } catch (err) {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
});

app.use('/api/auth', authRouter);

// Routes
app.use('/api/services', require('./routes/services'));
app.use('/api/portfolio', require('./routes/portfolio'));
app.use('/api/testimonials', require('./routes/testimonials'));
app.use('/api/contact', require('./routes/contact'));
app.use('/api/appointments', require('./routes/appointments'));
app.use('/api/smart-booking', require('./routes/smartBooking'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/interests', require('./routes/interests'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Error handling middleware (must be last)
app.use(require('./middleware/errorHandler'));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.get("/", (req, res) => {
  res.send("JMK Beauty Salon Backend is Running Successfully 🚀");
});