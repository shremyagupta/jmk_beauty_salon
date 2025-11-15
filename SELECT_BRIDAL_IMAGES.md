# How to Select and Add Best Bridal Makeup Images

## Step 1: Identify Best Bridal Makeup Posts

### What to Look For:
1. **High Quality Images**
   - Clear, well-lit photos
   - Good resolution (not blurry)
   - Professional-looking shots

2. **Best Bridal Looks**
   - Traditional South Asian bridal makeup (like your profile picture)
   - Complete bridal transformations
   - Before/after comparisons (if available)
   - Different styles (traditional, modern, fusion)

3. **Variety**
   - Different skin tones
   - Various jewelry styles
   - Different makeup styles
   - Day and night looks

### Instagram Posts to Check:
- Look for posts with hashtags: #bride, #bridalmakeup, #makeupartist
- Posts showing complete bridal looks
- Posts with multiple images (carousel posts)
- Your most liked/engaged bridal posts

## Step 2: Download Selected Images

### For Each Selected Image:
1. Open the Instagram post
2. If it's a carousel, swipe through to find the best image
3. Right-click on the image → "Save image as..."
4. Name them descriptively:
   - `bridal-traditional-gold-1.jpg`
   - `bridal-modern-elegant-1.jpg`
   - `bridal-complete-look-1.jpg`
   - `bridal-before-after-1.jpg`

## Step 3: Organize Images

Create folder: `client/public/images/portfolio/bridal-makeup/`

Place all bridal makeup images here.

## Step 4: Update Portfolio

### Option A: Using the Script
1. Edit `server/scripts/add-portfolio-images.js`
2. Update bridal makeup entries with your image paths:
```javascript
{
  title: 'Bridal Makeup - Traditional',
  description: 'Traditional South Asian bridal look with gold jewelry',
  category: 'makeup',
  imageUrl: '/images/portfolio/bridal-makeup/bridal-traditional-gold-1.jpg',
  featured: true,
  order: 1
}
```

### Option B: Manual Database Update
Update MongoDB with your image paths.

## Recommended: Select 5-8 Best Bridal Images

Based on your Instagram profile, look for:
1. **Profile Picture Style** - Traditional bridal with gold jewelry (like your profile pic)
2. **Complete Looks** - Full bridal transformations
3. **Different Styles** - Variety in makeup styles
4. **High Engagement** - Your most liked/commented posts
5. **Professional Quality** - Best lighting and composition

## Quick Checklist

- [ ] Browse through your 96 Instagram posts
- [ ] Identify 5-8 best bridal makeup posts
- [ ] Download images to `client/public/images/portfolio/bridal-makeup/`
- [ ] Name files descriptively
- [ ] Update database with image paths
- [ ] Test on website

