const express = require('express');
const router = express.Router();
const BeautyConsultation = require('../models/beautyConsultation');
const Service = require('../models/Service');

// Get all beauty consultations (Admin only)
router.get('/', async (req, res) => {
  try {
    const consultations = await BeautyConsultation.find()
      .populate('recommendations.service')
      .sort({ consultationDate: -1 });
    res.json(consultations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get consultation by ID
router.get('/:id', async (req, res) => {
  try {
    const consultation = await BeautyConsultation.findById(req.params.id)
      .populate('recommendations.service');
    if (!consultation) {
      return res.status(404).json({ message: 'Consultation not found' });
    }
    res.json(consultation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new beauty consultation
router.post('/', async (req, res) => {
  try {
    const consultation = new BeautyConsultation(req.body);
    
    // Generate AI-powered recommendations based on consultation data
    const recommendations = await generateRecommendations(req.body);
    consultation.recommendations = recommendations;
    
    // Generate try-on data
    consultation.tryOnData = await generateTryOnData(req.body);
    
    const savedConsultation = await consultation.save();
    const populatedConsultation = await BeautyConsultation.findById(savedConsultation._id)
      .populate('recommendations.service');
    
    res.status(201).json(populatedConsultation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update consultation
router.put('/:id', async (req, res) => {
  try {
    const consultation = await BeautyConsultation.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('recommendations.service');
    
    if (!consultation) {
      return res.status(404).json({ message: 'Consultation not found' });
    }
    
    res.json(consultation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete consultation
router.delete('/:id', async (req, res) => {
  try {
    const consultation = await BeautyConsultation.findByIdAndDelete(req.params.id);
    if (!consultation) {
      return res.status(404).json({ message: 'Consultation not found' });
    }
    res.json({ message: 'Consultation deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get consultations by customer email
router.get('/customer/:email', async (req, res) => {
  try {
    const consultations = await BeautyConsultation.find({ email: req.params.email })
      .populate('recommendations.service')
      .sort({ consultationDate: -1 });
    res.json(consultations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// AI Recommendation Engine
async function generateRecommendations(consultationData) {
  const recommendations = [];
  const { skinType, skinConcerns, preferredStyle, budgetRange } = consultationData;
  
  try {
    // Get all services
    const services = await Service.find({ isActive: true });
    
    // Skin type based recommendations
    if (skinType === 'oily') {
      const oilySkinServices = services.filter(s => 
        s.category === 'facial' && 
        s.description.toLowerCase().includes('oil') || 
        s.description.toLowerCase().includes('deep cleanse')
      );
      oilySkinServices.forEach(service => {
        recommendations.push({
          service: service._id,
          product: service.name,
          reason: 'Perfect for oily skin types to control excess oil and prevent breakouts',
          priority: 'high'
        });
      });
    }
    
    if (skinType === 'dry') {
      const drySkinServices = services.filter(s => 
        s.category === 'facial' && 
        (s.description.toLowerCase().includes('hydrating') || 
         s.description.toLowerCase().includes('moisture'))
      );
      drySkinServices.forEach(service => {
        recommendations.push({
          service: service._id,
          product: service.name,
          reason: 'Excellent for dry skin to restore moisture and hydration',
          priority: 'high'
        });
      });
    }
    
    // Skin concerns based recommendations
    if (skinConcerns.includes('acne')) {
      const acneServices = services.filter(s => 
        s.description.toLowerCase().includes('acne') || 
        s.description.toLowerCase().includes('purifying')
      );
      acneServices.forEach(service => {
        recommendations.push({
          service: service._id,
          product: service.name,
          reason: 'Targeted treatment for acne-prone skin',
          priority: 'high'
        });
      });
    }
    
    if (skinConcerns.includes('aging')) {
      const antiAgingServices = services.filter(s => 
        s.description.toLowerCase().includes('anti-aging') || 
        s.description.toLowerCase().includes('collagen') ||
        s.description.toLowerCase().includes('wrinkle')
      );
      antiAgingServices.forEach(service => {
        recommendations.push({
          service: service._id,
          product: service.name,
          reason: 'Anti-aging treatment to reduce fine lines and wrinkles',
          priority: 'medium'
        });
      });
    }
    
    // Style based recommendations
    if (preferredStyle === 'glamorous') {
      const glamServices = services.filter(s => 
        s.category === 'makeup' || s.category === 'hair'
      );
      glamServices.forEach(service => {
        recommendations.push({
          service: service._id,
          product: service.name,
          reason: 'Perfect for achieving a glamorous look',
          priority: 'medium'
        });
      });
    }
    
    // Budget based filtering
    if (budgetRange === 'budget') {
      return recommendations.filter((_, index) => index < 3); // Return top 3 recommendations
    } else if (budgetRange === 'mid-range') {
      return recommendations.filter((_, index) => index < 5); // Return top 5 recommendations
    }
    
    return recommendations.slice(0, 7); // Return up to 7 recommendations for premium/luxury
    
  } catch (error) {
    console.error('Error generating recommendations:', error);
    return [];
  }
}

// Generate try-on data based on consultation
async function generateTryOnData(consultationData) {
  const { skinType, skinConcerns, preferredStyle } = consultationData;
  
  const tryOnData = {
    faceShape: 'oval', // Default - in real app, this would come from face detection
    skinTone: getSkinToneRecommendation(skinType),
    recommendedColors: getColorRecommendations(skinType, preferredStyle),
    recommendedStyles: getStyleRecommendations(preferredStyle, skinConcerns)
  };
  
  return tryOnData;
}

function getSkinToneRecommendation(skinType) {
  const skinToneMap = {
    'oily': 'medium-warm',
    'dry': 'fair-cool',
    'combination': 'medium-neutral',
    'sensitive': 'fair-warm',
    'normal': 'medium-neutral'
  };
  return skinToneMap[skinType] || 'medium-neutral';
}

function getColorRecommendations(skinType, preferredStyle) {
  const colors = [];
  
  if (preferredStyle === 'natural') {
    colors.push('#E6B89C', '#D4A574', '#C19A6B'); // Nude, earthy tones
  } else if (preferredStyle === 'glamorous') {
    colors.push('#FF6B6B', '#4ECDC4', '#45B7D1'); // Bold, vibrant colors
  } else if (preferredStyle === 'professional') {
    colors.push('#8B7355', '#A0826D', '#BC9A6A'); // Professional browns
  } else if (preferredStyle === 'trendy') {
    colors.push('#FF69B4', '#9370DB', '#00CED1'); // Trendy purples and teals
  }
  
  return colors;
}

function getStyleRecommendations(preferredStyle, skinConcerns) {
  const styles = [];
  
  if (preferredStyle === 'natural') {
    styles.push('minimal-makeup', 'dewy-finish', 'soft-waves');
  } else if (preferredStyle === 'glamorous') {
    styles.push('smokey-eye', 'bold-lip', 'contoured-look');
  } else if (preferredStyle === 'professional') {
    styles.push('clean-makeup', 'structured-brow', 'polished-look');
  } else if (preferredStyle === 'trendy') {
    styles.push('glass-skin', 'gradient-lips', 'graphic-liner');
  }
  
  if (skinConcerns.includes('acne')) {
    styles.push('full-coverage', 'matte-finish');
  }
  
  return styles;
}

module.exports = router;
