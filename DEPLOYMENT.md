# Deployment Guide

This guide will help you deploy the JMK Beauty Salon application to production.

## Frontend Deployment (React)

### Option 1: Vercel (Recommended)

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Build the React app:
```bash
cd client
npm run build
```

3. Deploy:
```bash
vercel
```

4. Configure environment variables in Vercel dashboard:
   - `REACT_APP_API_URL` - Your backend API URL

### Option 2: Netlify

1. Build the React app:
```bash
cd client
npm run build
```

2. Drag and drop the `build` folder to Netlify

3. Configure environment variables:
   - `REACT_APP_API_URL` - Your backend API URL

### Option 3: Traditional Hosting

1. Build the React app:
```bash
cd client
npm run build
```

2. Upload the `build` folder contents to your web server

3. Configure your server to serve `index.html` for all routes

## Backend Deployment (Node.js)

### Option 1: Heroku

1. Install Heroku CLI

2. Login:
```bash
heroku login
```

3. Create Heroku app:
```bash
cd server
heroku create jmk-beauty-api
```

4. Set environment variables:
```bash
heroku config:set MONGODB_URI=your_mongodb_uri
heroku config:set NODE_ENV=production
heroku config:set PORT=5000
```

5. Deploy:
```bash
git push heroku main
```

### Option 2: DigitalOcean / AWS / Azure

1. Set up a Node.js server instance

2. Install dependencies:
```bash
cd server
npm install --production
```

3. Set up environment variables in `.env`

4. Use PM2 to run the server:
```bash
npm install -g pm2
pm2 start index.js --name jmk-beauty-api
pm2 save
pm2 startup
```

### Option 3: Railway / Render

1. Connect your GitHub repository

2. Set environment variables in the platform dashboard

3. Configure build command: `cd server && npm install`

4. Configure start command: `npm start`

## Database Deployment (MongoDB)

### Option 1: MongoDB Atlas (Recommended)

1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

2. Create a cluster

3. Get connection string

4. Update `MONGODB_URI` in your backend environment variables

5. Whitelist your server IP addresses

### Option 2: Self-Hosted MongoDB

1. Set up MongoDB on your server

2. Configure authentication

3. Update connection string in backend

## Environment Variables for Production

### Backend (.env)
```env
PORT=5000
MONGODB_URI=your_production_mongodb_uri
NODE_ENV=production
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

### Frontend
Update API calls to use production backend URL, or set:
```env
REACT_APP_API_URL=https://your-api-domain.com
```

## Security Checklist

- [ ] Use HTTPS for all connections
- [ ] Set secure CORS origins
- [ ] Use environment variables for sensitive data
- [ ] Enable MongoDB authentication
- [ ] Set up rate limiting
- [ ] Add authentication for admin routes
- [ ] Validate and sanitize all inputs
- [ ] Use secure session management
- [ ] Regular security updates
- [ ] Backup database regularly

## Post-Deployment

1. Test all API endpoints
2. Verify contact form works
3. Test appointment booking
4. Check portfolio images load correctly
5. Verify testimonials display
6. Test on mobile devices
7. Set up monitoring and logging
8. Configure backups

## Monitoring

Consider setting up:
- Application monitoring (e.g., Sentry)
- Uptime monitoring (e.g., UptimeRobot)
- Error logging
- Performance monitoring

## Updates

To update the application:

1. Pull latest changes
2. Update dependencies: `npm install`
3. Rebuild frontend: `cd client && npm run build`
4. Restart backend server
5. Run database migrations if needed

