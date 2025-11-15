# JMK Beauty Salon - Backend Server

Node.js/Express backend server with MongoDB integration.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```bash
cp .env.example .env
```

3. Update `.env` with your MongoDB connection string and other configurations.

4. Start the server:
```bash
# Development mode (with nodemon)
npm run dev

# Production mode
npm start
```

## API Documentation

See main README.md for API endpoint documentation.

## Database

Make sure MongoDB is running before starting the server. The server will automatically connect to the database specified in `MONGODB_URI`.

