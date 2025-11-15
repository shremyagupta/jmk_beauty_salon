# How to Add Instagram Images to Your Website

## Step 1: Download Images from Instagram

### Method 1: Manual Download
1. Go to https://www.instagram.com/jmk_beauty_salon/
2. Open each post you want to use
3. Right-click on the image and "Save image as..."
4. Save images with descriptive names like:
   - `bridal-makeup-1.jpg`
   - `hair-tutorial-1.jpg`
   - `mehndi-design-1.jpg`
   - `skincare-1.jpg`

### Method 2: Using Browser Extension
1. Install an Instagram downloader extension (like "Downloader for Instagram")
2. Visit your Instagram profile
3. Download all images you want to use

### Method 3: Using Online Tools
- Use websites like: https://downloadgram.org/
- Enter your Instagram post URL
- Download the image

## Step 2: Organize Images

Create a folder structure:
```
client/public/images/
├── portfolio/
│   ├── bridal-makeup/
│   ├── hair-tutorial/
│   ├── mehndi-design/
│   └── skincare/
```

## Step 3: Add Images to Website

### Option A: Using the Admin Panel (if you create one)
- Upload images through a web interface

### Option B: Update Database Directly
- Use MongoDB Compass or mongo shell
- Update portfolio items with image URLs

### Option C: Use the API
- POST request to `/api/portfolio` with image URLs

## Step 4: Image URLs

Once images are uploaded, you can:
1. Host them on your server: `/images/portfolio/bridal-makeup-1.jpg`
2. Use cloud storage: `https://your-cloud-storage.com/images/bridal-makeup-1.jpg`
3. Use CDN: `https://cdn.yoursite.com/images/bridal-makeup-1.jpg`

## Quick Start Script

See `add-portfolio-images.js` for a helper script to add images programmatically.

