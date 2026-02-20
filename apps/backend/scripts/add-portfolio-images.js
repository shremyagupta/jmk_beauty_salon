const mongoose = require('mongoose');
require('dotenv').config();
const Portfolio = require('../models/Portfolio');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/jmkbeauty';

// Portfolio items with image URLs
// INSTRUCTIONS: 
// 1. Download your best bridal makeup images from Instagram
// 2. Save them to: shared/assets/images/portfolio/bridal-makeup/
// 3. Update the imageUrl paths below to match your file names
// 4. Run: npm run add-images

const portfolioImages = [
  {
    title: 'Bridal Makeup - Traditional',
    description: 'Traditional South Asian bridal look with gold jewelry and elegant makeup',
    category: 'makeup',
    imageUrl: '/images/portfolio/bridal-makeup/bridal-traditional-1.jpg', // UPDATE THIS with your image filename
    featured: true,
    order: 1
  },
  {
    title: 'Bridal Makeup - Complete Look',
    description: 'Elegant complete bridal transformation for your special day',
    category: 'makeup',
    imageUrl: '/images/portfolio/bridal-makeup/bridal-complete-1.jpg', // UPDATE THIS with your image filename
    featured: true,
    order: 2
  },
  {
    title: 'Hair Tutorial',
    description: 'Professional hair styling tutorial and transformation',
    category: 'hair',
    imageUrl: '/images/portfolio/hair-tutorial-1.jpg', // Update with your image URL
    featured: true,
    order: 3
  },
  {
    title: 'Hair Styling',
    description: 'Beautiful hair transformation and styling',
    category: 'hair',
    imageUrl: '/images/portfolio/hair-styling-1.jpg', // Update with your image URL
    featured: false,
    order: 4
  },
  {
    title: 'Mehndi Design',
    description: 'Intricate mehndi patterns for hands and feet',
    category: 'mehndi',
    imageUrl: '/images/portfolio/mehndi-design-1.jpg', // Update with your image URL
    featured: true,
    order: 5
  },
  {
    title: 'Mehndi Art',
    description: 'Traditional mehndi design for brides and special occasions',
    category: 'mehndi',
    imageUrl: '/images/portfolio/mehndi-art-1.jpg', // Update with your image URL
    featured: false,
    order: 6
  },
  {
    title: 'Skincare Treatment',
    description: 'Professional skincare routine and treatments',
    category: 'skincare',
    imageUrl: '/images/portfolio/skincare-1.jpg', // Update with your image URL
    featured: false,
    order: 7
  },
  {
    title: 'Makeup Artist Work',
    description: 'Professional makeup artistry and techniques',
    category: 'makeup',
    imageUrl: '/images/portfolio/makeup-artist-1.jpg', // Update with your image URL
    featured: false,
    order: 8
  },
  {
    title: 'Model Makeup',
    description: 'Editorial and model makeup looks',
    category: 'makeup',
    imageUrl: '/images/portfolio/model-makeup-1.jpg', // Update with your image URL
    featured: false,
    order: 9
  },
  {
    title: 'Hair Tutorial',
    description: 'Step-by-step hair styling guide',
    category: 'hair',
    imageUrl: '/images/portfolio/hair-tutorial-2.jpg', // Update with your image URL
    featured: false,
    order: 10
  },
  {
    title: 'Bridal Look',
    description: 'Complete bridal transformation',
    category: 'makeup',
    imageUrl: '/images/portfolio/bridal-look-1.jpg', // Update with your image URL
    featured: false,
    order: 11
  },
  {
    title: 'Skincare Routine',
    description: 'Daily skincare beauty routine',
    category: 'skincare',
    imageUrl: '/images/portfolio/skincare-2.jpg', // Update with your image URL
    featured: false,
    order: 12
  }
];

async function addPortfolioImages() {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Clear existing portfolio items
    await Portfolio.deleteMany({});
    console.log('Cleared existing portfolio items');

    // Add new portfolio items with image URLs
    const createdItems = await Portfolio.insertMany(portfolioImages);
    console.log(`Successfully added ${createdItems.length} portfolio items with images!`);

    console.log('\nNext steps:');
    console.log('1. Place your images in: shared/assets/images/portfolio/');
    console.log('2. Or update imageUrl to point to your cloud storage/CDN');
    console.log('3. Make sure image paths match the imageUrl in the database');

    process.exit(0);
  } catch (error) {
    console.error('Error adding portfolio images:', error);
    process.exit(1);
  }
}

addPortfolioImages();

