# Quick Start Guide

Get your JMK Beauty Salon website up and running in minutes!

## Prerequisites Check

- [ ] Node.js installed (v14+)
- [ ] MongoDB installed and running (or MongoDB Atlas account)

## Installation Steps

### 1. Install Dependencies

```bash
# From the root directory
npm run install-all
```

### 2. Set Up Environment

```bash
# Copy the example env file
cd server
copy env.example .env
# (On Mac/Linux: cp env.example .env)
```

Edit `server/.env` and update:
- `MONGODB_URI` - Your MongoDB connection string
- Email settings (optional, for contact form)

### 3. Start MongoDB

**Local MongoDB:**
```bash
# Make sure MongoDB service is running
mongod
```

**MongoDB Atlas:**
- Use your connection string in `.env`
- No local installation needed

### 4. Seed Database (Optional)

```bash
cd server
npm run seed
```

This populates your database with sample data.

### 5. Run the Application

**Option A: Run Both Together**
```bash
# From root directory
npm run dev
```

**Option B: Run Separately**

Terminal 1 (Server):
```bash
cd server
npm run dev
```

Terminal 2 (Client):
```bash
cd client
npm start
```

### 6. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Health Check**: http://localhost:5000/api/health

## Troubleshooting

### MongoDB Connection Error
- Check if MongoDB is running
- Verify `MONGODB_URI` in `.env`
- For Atlas: Check IP whitelist and credentials

### Port Already in Use
- Change `PORT` in `server/.env`
- Or kill the process using the port

### Dependencies Not Installing
- Delete `node_modules` folders
- Delete `package-lock.json` files
- Run `npm install` again

## Next Steps

1. Update contact information in `client/src/pages/Contact.js`
2. Add your portfolio images to MongoDB
3. Customize colors in `client/src/index.css`
4. Add your social media links in `client/src/components/Footer.js`

## Need Help?

Check the main `README.md` for detailed documentation.

