const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/jmkbeauty', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Connected Successfully'))
.catch(err => console.error('MongoDB Connection Error:', err));

// Routes
app.use('/api/services', require('./routes/services'));
app.use('/api/portfolio', require('./routes/portfolio'));
app.use('/api/testimonials', require('./routes/testimonials'));
app.use('/api/contact', require('./routes/contact'));
app.use('/api/appointments', require('./routes/appointments'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Error handling middleware (must be last)
app.use(require('./middleware/errorHandler'));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

