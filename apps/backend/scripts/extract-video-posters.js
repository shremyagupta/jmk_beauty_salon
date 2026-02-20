/*
Extract a poster image (single frame) for each video referenced in
apps/frontend/public/portfolio-manifest.json and write `posterUrl` into manifest.
Uses @ffmpeg-installer/ffmpeg and fluent-ffmpeg.

Run: node scripts/extract-video-posters.js
*/
const fs = require('fs');
const path = require('path');
const ffmpegInstaller = require('@ffmpeg-installer/ffmpeg');
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegInstaller.path);

const root = path.join(__dirname, '..', '..', '..');
const imagesDir = path.join(root, 'shared', 'assets', 'images', 'portfolio');
const thumbsDir = path.join(imagesDir, 'thumbs');
const manifestPath = path.join(root, 'apps', 'frontend', 'public', 'portfolio-manifest.json');

const assetPathFromUrl = (url) => {
  if (!url) return null;
  const relativePath = url.replace(/^\//, '');
  return path.join(root, 'shared', 'assets', relativePath);
};

async function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function getFilenameFromUrl(url) {
  if (!url) return null;
  return url.split('/').pop();
}

function extractPoster(videoPath, outPath) {
  return new Promise((resolve, reject) => {
    ffmpeg(videoPath)
      .screenshots({
        timestamps: ['00:00:01.000', '00:00:02.000'],
        filename: path.basename(outPath),
        folder: path.dirname(outPath),
        size: '1280x?'
      })
      .on('end', () => resolve(outPath))
      .on('error', (err) => reject(err));
  });
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
      if (entry.type === 'video' && entry.videoUrl) {
        const fn = getFilenameFromUrl(entry.videoUrl);
        if (!fn) continue;
        const videoPath = assetPathFromUrl(entry.videoUrl);
        if (!fs.existsSync(videoPath)) {
          console.warn('Video not found:', videoPath);
          continue;
        }

        const posterName = `poster-${path.basename(fn, path.extname(fn))}.jpg`;
        const posterPath = path.join(thumbsDir, posterName);
        const posterUrl = `/images/portfolio/thumbs/${posterName}`;

        try {
          if (!fs.existsSync(posterPath)) {
            await extractPoster(videoPath, posterPath);
            console.log('Extracted poster for', fn);
          } else {
            console.log('Poster already exists for', fn);
          }
          if (entry.posterUrl !== posterUrl) {
            entry.posterUrl = posterUrl;
            changed = true;
          }
        } catch (err) {
          console.error('Failed to extract poster for', fn, err.message);
        }
      }
    }

    if (changed) {
      fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');
      console.log('Manifest updated with posterUrl entries.');
    } else {
      console.log('No manifest changes required for posters.');
    }

    console.log('Video poster extraction complete.');
  } catch (err) {
    console.error('Error extracting posters:', err);
    process.exit(1);
  }
})();
