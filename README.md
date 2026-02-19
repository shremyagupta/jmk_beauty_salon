# JMK Beauty Salon and Spa - Full Stack Application

A modern, full-stack web application for JMK Beauty Salon and Spa built with React, Node.js, Express, and MongoDB.

## 🔗 Live Demo

- Frontend (Vercel): https://jmk-beauty-salon.vercel.app

## 🧰 Tech Stack

- **Frontend:** React, React Router, Axios, CSS (responsive layout, animations)
- **Backend:** Node.js, Express, RESTful APIs
- **Database:** MongoDB with Mongoose
- **Other:** Nodemailer (email), image optimization scripts, Razorpay integration scaffold

## 🚀 Features

- **React Frontend**: Modern, responsive UI with smooth animations
- **Node.js/Express Backend**: RESTful API with MongoDB integration
- **MongoDB Database**: Store services, portfolio, testimonials, contacts, and appointments
- **Portfolio Gallery**: Filterable portfolio with lightbox modal
- **Contact Form**: Submit inquiries with email notifications
- **Appointment Booking**: Book appointments with conflict checking
- **Testimonials**: Client reviews and ratings
- **Services Management**: Dynamic service listings

## 📁 Project Structure

```
jmk-beauty-salon/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
├── server/                 # Node.js backend
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── index.js           # Server entry point
│   └── package.json
├── package.json           # Root package.json
└── README.md
```

## 🛠️ Installation & Setup

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Step 1: Install Dependencies

```bash
# Install root dependencies
npm install

# Install all dependencies (server + client)
npm run install-all
```

Or install separately:

```bash
# Server dependencies
cd server
npm install

# Client dependencies
cd ../client
npm install
```

### Step 2: Configure Environment Variables

Create a `.env` file in the `server` directory:

```bash
cd server
cp .env.example .env
```

Edit `server/.env` with your configuration:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/jmkbeauty
NODE_ENV=development

# Email Configuration (optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

### Step 3: Start MongoDB

**Local MongoDB:**
```bash
# Make sure MongoDB is running
mongod
```

**MongoDB Atlas:**
- Create a cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Get your connection string and update `MONGODB_URI` in `.env`

### Step 4: Seed the Database (Optional)

Populate the database with sample data:

```bash
cd server
npm run seed
```

This will add sample services, portfolio items, and testimonials to your database.

### Step 5: Run the Application

**Development Mode (runs both server and client):**
```bash
npm run dev
```

**Or run separately:**

Terminal 1 - Server:
```bash
npm run server
# or
cd server && npm run dev
```

Terminal 2 - Client:
```bash
npm run client
# or
cd client && npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 📡 API Endpoints

### Services
- `GET /api/services` - Get all services
- `GET /api/services/:id` - Get service by ID
- `GET /api/services/category/:category` - Get services by category
- `POST /api/services` - Create service (Admin)
- `PUT /api/services/:id` - Update service (Admin)
- `DELETE /api/services/:id` - Delete service (Admin)

### Portfolio
- `GET /api/portfolio` - Get all portfolio items
- `GET /api/portfolio?category=hair` - Filter by category
- `GET /api/portfolio/:id` - Get portfolio item by ID
- `GET /api/portfolio/featured/all` - Get featured items
- `POST /api/portfolio` - Create portfolio item (Admin)
- `PUT /api/portfolio/:id` - Update portfolio item (Admin)
- `DELETE /api/portfolio/:id` - Delete portfolio item (Admin)

### Testimonials
- `GET /api/testimonials` - Get all approved testimonials
- `GET /api/testimonials/:id` - Get testimonial by ID
- `GET /api/testimonials/featured/all` - Get featured testimonials
- `POST /api/testimonials` - Submit testimonial
- `PUT /api/testimonials/:id` - Update testimonial (Admin)
- `DELETE /api/testimonials/:id` - Delete testimonial (Admin)

### Contact
- `POST /api/contact` - Submit contact form
- `GET /api/contact` - Get all contacts (Admin)
- `GET /api/contact/:id` - Get contact by ID (Admin)
- `PUT /api/contact/:id` - Update contact status (Admin)
- `DELETE /api/contact/:id` - Delete contact (Admin)

### Appointments
- `POST /api/appointments` - Book appointment
- `GET /api/appointments` - Get all appointments (Admin)
- `GET /api/appointments/:id` - Get appointment by ID
- `PUT /api/appointments/:id` - Update appointment
- `DELETE /api/appointments/:id` - Delete appointment

## 🗄️ Database Models

### Service
- name, category, description, services[], icon, price, duration, isActive

### Portfolio
- title, description, category, imageUrl, imageAlt, featured, order

### Testimonial
- name, role, rating, text, avatar, isApproved, featured

### Contact
- name, email, phone, message, subject, status, repliedAt

### Appointment
- name, email, phone, service, date, time, message, status

## 🎨 Customization

### Update Contact Information
Edit `client/src/pages/Contact.js` to update address, phone, email, and hours.

### Change Colors
Edit CSS variables in `client/src/index.css`:
```css
:root {
    --primary-color: #d4a574;
    --secondary-color: #8b6f47;
    /* ... */
}
```

### Add Portfolio Images
Replace placeholder divs with actual images in the portfolio items. Update the `imageUrl` field in MongoDB.

## 🚢 Production Build

```bash
# Build React app
cd client
npm run build

# The build folder will be created in client/build/
```

## 📝 Notes

- The contact form sends emails if email configuration is set up in `.env`
- Testimonials require admin approval before being displayed
- Appointments check for conflicts before booking
- All admin routes should be protected with authentication (to be implemented)

## 🔒 Security Recommendations

1. Add authentication middleware for admin routes
2. Implement rate limiting for API endpoints
3. Add input validation and sanitization
4. Use environment variables for sensitive data
5. Implement CORS properly for production
6. Add HTTPS in production

## 📄 License

This project is created for JMK Beauty Salon and Spa.
Shremya Gupta

## 🤝 Support

For issues or questions, please contact the development team.
