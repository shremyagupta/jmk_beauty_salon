/*
Generate image thumbnails for images referenced in apps/frontend/public/portfolio-manifest.json
Creates thumbnails in shared/assets/images/portfolio/thumbs and updates the manifest with `thumbUrl` entries.

Requirements:
- `sharp` must be installed in the server project: `npm install sharp`

Run:
  node scripts/generate-thumbs.js
*/

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const root = path.join(__dirname, '..', '..', '..');
const imagesDir = path.join(root, 'shared', 'assets', 'images', 'portfolio');
const thumbsDir = path.join(imagesDir, 'thumbs');
const manifestPath = path.join(root, 'apps', 'frontend', 'public', 'portfolio-manifest.json');

const THUMB_WIDTH = 480;

async function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function getFilenameFromUrl(url) {
  if (!url) return null;
  return url.split('/').pop();
}

(async function main() {
  try {
    if (!fs.existsSync(manifestPath)) {
      console.error('Manifest not found at', manifestPath);
      process.exit(1);
    }

    await ensureDir(thumbsDir);

    const raw = fs.readFileSync(manifestPath, 'utf8');
    const manifest = JSON.parse(raw);
    let changed = false;

    for (let entry of manifest) {
      if (entry.imageUrl) {
        const filename = getFilenameFromUrl(entry.imageUrl);
        if (!filename) continue;
        const srcPath = path.join(imagesDir, filename);
        if (!fs.existsSync(srcPath)) {
          console.warn('Source image missing:', srcPath);
          continue;
        }

        const thumbName = `thumb-${filename}`;
        const thumbPath = path.join(thumbsDir, thumbName);
        const thumbUrl = `/images/portfolio/thumbs/${thumbName}`;

        if (!entry.thumbUrl || entry.thumbUrl !== thumbUrl) {
          try {
            await sharp(srcPath)
              .resize({ width: THUMB_WIDTH })
              .jpeg({ quality: 80 })
              .toFile(thumbPath);
            entry.thumbUrl = thumbUrl;
            changed = true;
            console.log('Created thumb for', filename);
          } catch (err) {
            console.error('Failed to create thumb for', filename, err.message);
          }
        } else {
          // thumb already set; skip creation if exists
          if (!fs.existsSync(thumbPath)) {
            try {
              await sharp(srcPath)
                .resize({ width: THUMB_WIDTH })
                .jpeg({ quality: 80 })
                .toFile(thumbPath);
              console.log('Recreated missing thumb for', filename);
            } catch (err) {
              console.error('Failed to recreate thumb for', filename, err.message);
            }
          }
        }
      }
    }

    if (changed) {
      fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');
      console.log('Manifest updated with thumbUrl entries.');
    } else {
      console.log('No manifest changes required.');
    }

    console.log('Thumbnail generation complete.');
  } catch (err) {
    console.error('Error generating thumbnails:', err);
    process.exit(1);
  }
})();
