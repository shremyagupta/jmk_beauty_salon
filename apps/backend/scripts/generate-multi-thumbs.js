/*
Generate responsive thumbnails (multiple widths) for images referenced in apps/frontend/public/portfolio-manifest.json
Creates thumbnails in shared/assets/images/portfolio/thumbs/ and updates the manifest with `srcSet` and `thumbUrl` (default)

Requirements:
- `sharp` must be installed in the server project (already installed previously)

Run:
  node scripts/generate-multi-thumbs.js
*/

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const root = path.join(__dirname, '..', '..', '..');
const imagesDir = path.join(root, 'shared', 'assets', 'images', 'portfolio');
const thumbsDir = path.join(imagesDir, 'thumbs');
const manifestPath = path.join(root, 'apps', 'frontend', 'public', 'portfolio-manifest.json');

const SIZES = [320, 480, 768];

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
      if (!entry.imageUrl) continue;
      const filename = getFilenameFromUrl(entry.imageUrl);
      if (!filename) continue;
      const srcPath = path.join(imagesDir, filename);
      if (!fs.existsSync(srcPath)) {
        console.warn('Source image missing:', srcPath);
        continue;
      }

      const srcSetParts = [];

      for (let w of SIZES) {
        const ext = path.extname(filename).toLowerCase();
        const base = path.basename(filename, ext);
        const outName = `thumb-${w}-${base}.jpg`;
        const outPath = path.join(thumbsDir, outName);
        try {
          // Convert to jpg thumbnails for consistent delivery
          await sharp(srcPath)
            .rotate()
            .resize({ width: w })
            .jpeg({ quality: 80 })
            .toFile(outPath);
          const url = `/images/portfolio/thumbs/${outName}`;
          srcSetParts.push(`${url} ${w}w`);
          console.log(`Created: ${outName}`);
        } catch (err) {
          console.error('Failed to create thumb', outName, err.message);
        }
      }

      if (srcSetParts.length) {
        const srcSet = srcSetParts.join(', ');
        const defaultThumb = srcSetParts.find(s => s.includes('480w')) || srcSetParts[0];
        const defaultUrl = defaultThumb ? defaultThumb.split(' ')[0] : null;
        if (entry.srcSet !== srcSet || entry.thumbUrl !== defaultUrl) {
          entry.srcSet = srcSet;
          entry.thumbUrl = defaultUrl;
          changed = true;
        }
      }
    }

    if (changed) {
      fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');
      console.log('Manifest updated with srcSet and thumbUrl entries.');
    } else {
      console.log('No manifest changes required.');
    }

    console.log('Multi-size thumbnail generation complete.');
  } catch (err) {
    console.error('Error generating multi-size thumbnails:', err);
    process.exit(1);
  }
})();
