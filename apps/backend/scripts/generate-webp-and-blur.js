/*
Generate WebP variants for thumbnails and tiny blurred placeholders.
Updates `apps/frontend/public/portfolio-manifest.json` adding `webpSrcSet` and `blurDataURL`.

Requirements: `sharp` is already installed.
Run:
  node scripts/generate-webp-and-blur.js
*/
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const root = path.join(__dirname, '..', '..', '..');
const imagesDir = path.join(root, 'shared', 'assets', 'images', 'portfolio');
const thumbsDir = path.join(imagesDir, 'thumbs');
const manifestPath = path.join(root, 'apps', 'frontend', 'public', 'portfolio-manifest.json');

const SIZES = [320, 480, 768];
const BLUR_SIZE = 20; // tiny blurred placeholder width

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

      // create webp variants for sizes
      const webpParts = [];
      for (let w of SIZES) {
        const base = path.basename(filename, path.extname(filename));
        const outName = `thumb-${w}-${base}.webp`;
        const outPath = path.join(thumbsDir, outName);
        try {
          await sharp(srcPath)
            .rotate()
            .resize({ width: w })
            .webp({ quality: 75 })
            .toFile(outPath);
          const url = `/images/portfolio/thumbs/${outName}`;
          webpParts.push(`${url} ${w}w`);
          console.log('Created webp:', outName);
        } catch (err) {
          console.error('Failed to create webp', outName, err.message);
        }
      }

      // create tiny blurred placeholder
      let blurDataURL = entry.blurDataURL;
      try {
        const base = path.basename(filename, path.extname(filename));
        const blurOutName = `blur-${base}.jpg`;
        const blurOutPath = path.join(thumbsDir, blurOutName);
        const buffer = await sharp(srcPath)
          .rotate()
          .resize({ width: BLUR_SIZE })
          .blur()
          .jpeg({ quality: 50 })
          .toBuffer();
        const b64 = buffer.toString('base64');
        blurDataURL = `data:image/jpeg;base64,${b64}`;
        console.log('Created blur placeholder for', filename);
      } catch (err) {
        console.error('Failed to create blur placeholder for', filename, err.message);
      }

      if (webpParts.length) {
        const webpSrcSet = webpParts.join(', ');
        if (entry.webpSrcSet !== webpSrcSet || entry.blurDataURL !== blurDataURL) {
          entry.webpSrcSet = webpSrcSet;
          entry.blurDataURL = blurDataURL;
          changed = true;
        }
      }
    }

    if (changed) {
      fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');
      console.log('Manifest updated with webpSrcSet and blurDataURL entries.');
    } else {
      console.log('No manifest changes required.');
    }

    console.log('WebP and blur generation complete.');
  } catch (err) {
    console.error('Error generating webp and blur placeholders:', err);
    process.exit(1);
  }
})();
