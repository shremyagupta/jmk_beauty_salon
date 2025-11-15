# Quick Guide: Adding Instagram Images to Your Website

## Method 1: Quick Setup (Recommended)

### Step 1: Download Images from Instagram
1. Visit: https://www.instagram.com/jmk_beauty_salon/
2. Browse through your 96 posts
3. For each image you want to use:
   - Click on the post
   - Right-click the image → "Save image as..."
   - Save with descriptive names

### Step 2: Organize Images
Create these folders in `client/public/images/portfolio/`:
- `bridal-makeup/` - For bridal makeup images
- `hair-tutorial/` - For hair styling images  
- `mehndi-design/` - For mehndi/henna images
- `skincare/` - For skincare images

### Step 3: Add Images to Database

**Option A: Using the Script**
1. Update `server/scripts/add-portfolio-images.js` with your image file names
2. Run: `cd server && node scripts/add-portfolio-images.js`

**Option B: Using MongoDB**
1. Open MongoDB Compass
2. Connect to your database
3. Go to `portfolios` collection
4. Update each document's `imageUrl` field with the path like:
   - `/images/portfolio/bridal-makeup/bridal-1.jpg`
   - `/images/portfolio/hair-tutorial/hair-1.jpg`
   - etc.

**Option C: Using API**
```javascript
// Example: Update portfolio item
fetch('/api/portfolio/PORTFOLIO_ID', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    imageUrl: '/images/portfolio/bridal-makeup/bridal-1.jpg'
  })
})
```

## Method 2: Using Cloud Storage (Better for Production)

### Upload to Cloud Storage
1. Upload images to:
   - Cloudinary (free tier available)
   - AWS S3
   - Google Cloud Storage
   - Or any CDN

2. Update `imageUrl` in database with full URL:
   ```
   https://res.cloudinary.com/your-account/image/upload/bridal-makeup-1.jpg
   ```

## Method 3: Direct Instagram URLs (Temporary)

⚠️ **Note**: Instagram URLs expire, so this is only for testing.

1. Right-click image on Instagram → "Copy image address"
2. Use that URL directly in `imageUrl` field
3. **Important**: Replace with permanent URLs before going live

## Image Naming Convention

Use descriptive names:
- `bridal-makeup-traditional-1.jpg`
- `hair-tutorial-updo-1.jpg`
- `mehndi-arabic-design-1.jpg`
- `skincare-facial-1.jpg`

## Recommended Image Sizes

- Portfolio thumbnails: 800x800px (square)
- Full size images: 1200x1200px or larger
- Format: JPG or PNG
- Optimize images before uploading (use tools like TinyPNG)

## Testing

After adding images:
1. Restart your React app
2. Visit http://localhost:3000/portfolio
3. Images should display automatically
4. Click on images to view in lightbox

## Troubleshooting

**Images not showing?**
- Check image paths are correct
- Ensure images are in `client/public/images/portfolio/`
- Check browser console for 404 errors
- Verify imageUrl in database matches file location

**Images loading slowly?**
- Optimize image sizes
- Use CDN/cloud storage
- Enable image compression

