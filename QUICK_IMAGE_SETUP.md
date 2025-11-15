# Quick Setup: Add Bridal Makeup Images from Instagram

## 🎯 Goal: Add 5-8 Best Bridal Makeup Images to Portfolio

## Step 1: Select Images from Instagram (5 minutes)

1. **Visit your Instagram**: https://www.instagram.com/jmk_beauty_salon/
2. **Look for posts with**:
   - Complete bridal looks
   - Traditional South Asian bridal style (like your profile pic)
   - High quality, clear images
   - Your most liked/commented posts
3. **Select 5-8 best images** that showcase:
   - Traditional bridal makeup
   - Modern bridal looks
   - Complete transformations
   - Different styles and angles

## Step 2: Download Images (5 minutes)

For each selected image:
1. Click on the Instagram post
2. Right-click the image → "Save image as..."
3. Save to: `client/public/images/portfolio/bridal-makeup/`
4. Name them:
   - `bridal-1.jpg`
   - `bridal-2.jpg`
   - `bridal-3.jpg`
   - etc.

## Step 3: Update Script (2 minutes)

1. Open: `server/scripts/add-portfolio-images.js`
2. Find the bridal makeup entries (first 2-3 items)
3. Update `imageUrl` to match your file names:
   ```javascript
   imageUrl: '/images/portfolio/bridal-makeup/bridal-1.jpg'
   imageUrl: '/images/portfolio/bridal-makeup/bridal-2.jpg'
   ```

## Step 4: Run Script (1 minute)

```bash
cd server
npm run add-images
```

## Step 5: View Results

1. Refresh your browser: http://localhost:3000/portfolio
2. Click "Bridal Makeup" filter
3. Your images should appear!

## Tips for Best Results:

✅ **Choose images that:**
- Show complete bridal looks
- Have good lighting
- Are high resolution
- Showcase your best work
- Match your profile picture style

❌ **Avoid:**
- Blurry images
- Incomplete looks
- Poor quality photos
- Too many similar images

## Need Help?

- See `BRIDAL_MAKEUP_SELECTION.md` for detailed selection guide
- See `INSTAGRAM_IMAGES_SETUP.md` for full instructions

