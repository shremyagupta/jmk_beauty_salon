const mongoose = require('mongoose');
require('dotenv').config();

const Service = require('./models/Service');
const Portfolio = require('./models/Portfolio');
const Testimonial = require('./models/Testimonial');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/jmkbeauty';

// Sample data
const services = [
  {
    name: 'Hair Services',
    category: 'hair',
    description: 'Cutting, coloring, styling, extensions, and treatments for all hair types',
    services: ['Haircuts & Styling', 'Hair Coloring', 'Hair Treatments', 'Extensions'],
    icon: '💇',
    price: 50,
    duration: '1-2 hours'
  },
  {
    name: 'Nail Care',
    category: 'nails',
    description: 'Manicures, pedicures, nail art, and gel polish services',
    services: ['Manicures', 'Pedicures', 'Nail Art', 'Gel Polish'],
    icon: '💅',
    price: 35,
    duration: '1 hour'
  },
  {
    name: 'Facial & Skincare',
    category: 'facial',
    description: 'Professional facials, skin treatments, and anti-aging solutions',
    services: ['Deep Cleansing Facials', 'Anti-Aging Treatments', 'Acne Solutions', 'Hydrating Masks'],
    icon: '✨',
    price: 80,
    duration: '1.5 hours'
  },
  {
    name: 'Massage Therapy',
    category: 'massage',
    description: 'Relaxing and therapeutic massage services for your wellness',
    services: ['Swedish Massage', 'Deep Tissue', 'Hot Stone', 'Aromatherapy'],
    icon: '💆',
    price: 90,
    duration: '1 hour'
  },
  {
    name: 'Makeup Services',
    category: 'makeup',
    description: 'Professional makeup for special occasions and events',
    services: ['Bridal Makeup', 'Party Makeup', 'Editorial Makeup', 'Makeup Lessons'],
    icon: '💄',
    price: 75,
    duration: '1-2 hours'
  },
  {
    name: 'Spa Packages',
    category: 'spa',
    description: 'Complete spa experiences with multiple treatments',
    services: ['Full Day Spa', 'Couples Packages', 'Detox Programs', 'Wellness Retreats'],
    icon: '🧖',
    price: 200,
    duration: '3-4 hours'
  }
];

const portfolioItems = [
  {
    title: 'Bridal Makeup',
    description: 'Traditional South Asian bridal look with gold jewelry and elegant makeup',
    category: 'makeup',
    imageUrl: '',
    featured: true,
    order: 1
  },
  {
    title: 'Bridal Makeup',
    description: 'Elegant bridal makeup for your special day',
    category: 'makeup',
    imageUrl: '',
    featured: true,
    order: 2
  },
  {
    title: 'Hair Tutorial',
    description: 'Professional hair styling tutorial and transformation',
    category: 'hair',
    imageUrl: '',
    featured: true,
    order: 3
  },
  {
    title: 'Hair Styling',
    description: 'Beautiful hair transformation and styling',
    category: 'hair',
    imageUrl: '',
    featured: false,
    order: 4
  },
  {
    title: 'Mehndi Design',
    description: 'Intricate mehndi patterns for hands and feet',
    category: 'mehndi',
    imageUrl: '',
    featured: true,
    order: 5
  },
  {
    title: 'Mehndi Art',
    description: 'Traditional mehndi design for brides and special occasions',
    category: 'mehndi',
    imageUrl: '',
    featured: false,
    order: 6
  },
  {
    title: 'Skincare Treatment',
    description: 'Professional skincare routine and treatments',
    category: 'skincare',
    imageUrl: '',
    featured: false,
    order: 7
  },
  {
    title: 'Makeup Artist Work',
    description: 'Professional makeup artistry and techniques',
    category: 'makeup',
    imageUrl: '',
    featured: false,
    order: 8
  },
  {
    title: 'Model Makeup',
    description: 'Editorial and model makeup looks',
    category: 'makeup',
    imageUrl: '',
    featured: false,
    order: 9
  },
  {
    title: 'Hair Tutorial',
    description: 'Step-by-step hair styling guide',
    category: 'hair',
    imageUrl: '',
    featured: false,
    order: 10
  },
  {
    title: 'Bridal Look',
    description: 'Complete bridal transformation',
    category: 'makeup',
    imageUrl: '',
    featured: false,
    order: 11
  },
  {
    title: 'Skincare Routine',
    description: 'Daily skincare beauty routine',
    category: 'skincare',
    imageUrl: '',
    featured: false,
    order: 12
  }
];

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Regular Client',
    rating: 5,
    text: "Absolutely amazing experience! The staff is professional, friendly, and truly talented. My hair has never looked better. Highly recommend JMK Beauty!",
    avatar: 'S',
    isApproved: true,
    featured: true
  },
  {
    name: 'Maria Garcia',
    role: 'Spa Enthusiast',
    rating: 5,
    text: "The spa treatments here are incredible! I felt completely relaxed and rejuvenated. The facial was exactly what I needed. Will definitely be back!",
    avatar: 'M',
    isApproved: true,
    featured: true
  },
  {
    name: 'Emily Chen',
    role: 'Bride',
    rating: 5,
    text: "Best bridal makeup I've ever had! The team made me feel like a princess on my special day. The attention to detail was outstanding. Thank you!",
    avatar: 'E',
    isApproved: true,
    featured: true
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Clear existing data
    await Service.deleteMany({});
    await Portfolio.deleteMany({});
    await Testimonial.deleteMany({});
    console.log('Cleared existing data');

    // Insert services
    await Service.insertMany(services);
    console.log(`Inserted ${services.length} services`);

    // Insert portfolio items
    await Portfolio.insertMany(portfolioItems);
    console.log(`Inserted ${portfolioItems.length} portfolio items`);

    // Insert testimonials
    await Testimonial.insertMany(testimonials);
    console.log(`Inserted ${testimonials.length} testimonials`);

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();

