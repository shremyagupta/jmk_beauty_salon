# Project Structure

Complete overview of the JMK Beauty Salon application structure.

## Root Directory

```
jmk-beauty-salon/
├── client/              # React frontend application
├── server/              # Node.js backend application
├── package.json         # Root package.json with scripts
├── README.md            # Main documentation
├── QUICKSTART.md        # Quick start guide
├── DEPLOYMENT.md        # Deployment instructions
├── .gitignore          # Git ignore rules
└── PROJECT_STRUCTURE.md # This file
```

## Client (React Frontend)

```
client/
├── public/
│   ├── index.html       # HTML template
│   └── manifest.json    # PWA manifest
├── src/
│   ├── components/      # Reusable React components
│   │   ├── Navbar.js    # Navigation component
│   │   ├── Navbar.css
│   │   ├── Footer.js    # Footer component
│   │   └── Footer.css
│   ├── pages/           # Page components
│   │   ├── Home.js      # Homepage
│   │   ├── Home.css
│   │   ├── About.js     # About page
│   │   ├── About.css
│   │   ├── Services.js  # Services page
│   │   ├── Services.css
│   │   ├── Portfolio.js # Portfolio gallery
│   │   ├── Portfolio.css
│   │   ├── Testimonials.js # Testimonials page
│   │   ├── Testimonials.css
│   │   ├── Contact.js   # Contact form page
│   │   └── Contact.css
│   ├── App.js           # Main App component
│   ├── App.css          # Global app styles
│   ├── index.js         # React entry point
│   └── index.css        # Global styles & CSS variables
├── package.json         # Frontend dependencies
└── README.md            # Frontend documentation
```

## Server (Node.js Backend)

```
server/
├── models/              # MongoDB Mongoose models
│   ├── Service.js       # Service model
│   ├── Portfolio.js     # Portfolio item model
│   ├── Testimonial.js   # Testimonial model
│   ├── Contact.js       # Contact form model
│   └── Appointment.js   # Appointment model
├── routes/              # API route handlers
│   ├── services.js      # Service CRUD operations
│   ├── portfolio.js     # Portfolio CRUD operations
│   ├── testimonials.js  # Testimonial CRUD operations
│   ├── contact.js       # Contact form handling
│   └── appointments.js  # Appointment booking
├── middleware/          # Express middleware
│   ├── errorHandler.js  # Error handling middleware
│   └── validateRequest.js # Request validation
├── index.js             # Server entry point
├── seed.js              # Database seeding script
├── package.json         # Backend dependencies
├── env.example          # Environment variables example
└── README.md            # Backend documentation
```

## Key Features

### Frontend Features
- **React Router**: Client-side routing
- **Axios**: HTTP client for API calls
- **Responsive Design**: Mobile-first approach
- **Portfolio Lightbox**: Image gallery with filtering
- **Form Handling**: Contact and appointment forms
- **Dynamic Content**: Data fetched from backend API

### Backend Features
- **RESTful API**: Standard HTTP methods
- **MongoDB Integration**: Mongoose ODM
- **Error Handling**: Centralized error middleware
- **Email Support**: Nodemailer integration
- **CORS**: Cross-origin resource sharing
- **Environment Config**: dotenv for configuration

## Data Flow

1. **User Interaction** → React Component
2. **API Call** → Axios request to backend
3. **Backend Route** → Express route handler
4. **Database Query** → Mongoose model operation
5. **Response** → JSON data back to frontend
6. **UI Update** → React state update

## API Endpoints Structure

All API endpoints follow RESTful conventions:

- `GET /api/resource` - List all
- `GET /api/resource/:id` - Get one
- `POST /api/resource` - Create new
- `PUT /api/resource/:id` - Update existing
- `DELETE /api/resource/:id` - Delete

## Environment Variables

### Server (.env)
- `PORT` - Server port
- `MONGODB_URI` - Database connection string
- `NODE_ENV` - Environment (development/production)
- `EMAIL_*` - Email configuration

### Client
- `REACT_APP_API_URL` - Backend API URL (optional)

## Database Collections

1. **services** - Salon services catalog
2. **portfolios** - Portfolio/gallery items
3. **testimonials** - Client reviews
4. **contacts** - Contact form submissions
5. **appointments** - Booking records

## Development Workflow

1. Start MongoDB
2. Start backend server (`npm run server`)
3. Start frontend dev server (`npm run client`)
4. Make changes
5. Test locally
6. Deploy to production

## File Naming Conventions

- **Components**: PascalCase (e.g., `Navbar.js`)
- **Pages**: PascalCase (e.g., `Home.js`)
- **Styles**: PascalCase (e.g., `Navbar.css`)
- **Routes**: camelCase (e.g., `services.js`)
- **Models**: PascalCase (e.g., `Service.js`)

