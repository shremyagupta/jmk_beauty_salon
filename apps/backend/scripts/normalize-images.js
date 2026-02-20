/*
 Node script to normalize filenames in `images/portfolio/` and update
 `apps/frontend/public/portfolio-manifest.json` accordingly.

 This script will:
 - read files in images/portfolio
 - create a normalized filename (lowercase, replace spaces and special chars with '-')
 - rename the files on disk (if needed)
 - update the manifest entries' imageUrl/videoUrl paths

 NOTE: Run this only after backing up your images folder.
 Usage:
   node scripts/normalize-images.js
*/

const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..', '..', '..');
const imagesDir = path.join(root, 'shared', 'assets', 'images', 'portfolio');
const manifestPath = path.join(root, 'apps', 'frontend', 'public', 'portfolio-manifest.json');

function normalizeName(name) {
  return name
    .toLowerCase()
    .replace(/[#%\^&*{}\\:<>?`~!@()+=,;"'\[\]]+/g, '') // remove special chars
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .replace(/^-+|-+$/g, '');
}

(async function main() {
  try {
    if (!fs.existsSync(imagesDir)) {
      console.error('images/portfolio directory not found:', imagesDir);
      process.exit(1);
    }

    const files = fs.readdirSync(imagesDir);
    const mapping = {};

    for (const f of files) {
      const oldPath = path.join(imagesDir, f);
      const ext = path.extname(f);
      const base = path.basename(f, ext);
      const normalizedBase = normalizeName(base) || 'image';
      let newFile = `${normalizedBase}${ext.toLowerCase()}`;
      let counter = 1;
      while (fs.existsSync(path.join(imagesDir, newFile)) && newFile !== f) {
        newFile = `${normalizedBase}-${counter}${ext.toLowerCase()}`;
        counter++;
      }

      if (newFile !== f) {
        const newPath = path.join(imagesDir, newFile);
        fs.renameSync(oldPath, newPath);
        mapping[f] = newFile;
        console.log(`Renamed: "${f}" -> "${newFile}"`);
      } else {
        mapping[f] = f;
        console.log(`No change: "${f}"`);
      }
    }

    if (fs.existsSync(manifestPath)) {
      const manifestRaw = fs.readFileSync(manifestPath, 'utf8');
      let manifest = JSON.parse(manifestRaw);
      let changed = false;
      manifest = manifest.map((entry) => {
        const e = { ...entry };
        if (e.imageUrl) {
          const parts = e.imageUrl.split('/');
          const fn = parts[parts.length - 1];
          if (mapping[fn] && mapping[fn] !== fn) {
            parts[parts.length - 1] = mapping[fn];
            e.imageUrl = parts.join('/');
            changed = true;
          }
        }
        if (e.videoUrl) {
          const parts = e.videoUrl.split('/');
          const fn = parts[parts.length - 1];
          if (mapping[fn] && mapping[fn] !== fn) {
            parts[parts.length - 1] = mapping[fn];
            e.videoUrl = parts.join('/');
            changed = true;
          }
        }
        return e;
      });

      if (changed) {
        fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');
        console.log('Updated manifest with normalized filenames.');
      } else {
        console.log('Manifest did not need updates.');
      }
    } else {
      console.log('Manifest not found at', manifestPath, '- skipping manifest update.');
    }

    console.log('Normalization complete.');
  } catch (err) {
    console.error('Error during normalization:', err);
    process.exit(1);
  }
})();
