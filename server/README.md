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

## Role-Based Access

- Owner/admin credentials come from `ADMIN_USERNAME` and `ADMIN_PASSWORD`.
- Configure staff logins via `STAFF_USERS` using comma-separated `username:password[:role]` entries. Omit the role segment to default to `staff`.
- JWT payloads now include the authenticated role, and protected routes enforce access via role checks.

## Notifications

- Configure SMTP variables (`EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`, `EMAIL_PASS`, `FROM_EMAIL`) to send booking alerts and confirmations.
- Optional Twilio SMS confirmations are enabled when `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, and `TWILIO_PHONE_NUMBER` are set. Clients receive a text after requesting an appointment and again when it is confirmed.




