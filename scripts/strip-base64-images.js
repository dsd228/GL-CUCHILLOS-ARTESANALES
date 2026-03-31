#!/usr/bin/env node
/**
 * strip-base64-images.js
 * Removes base64 data URIs from catalog JSON files.
 * - Sets product.image to "" when it starts with "data:image/"
 * - Removes media entries where src starts with "data:image/"
 * Idempotent: running multiple times produces the same result.
 *
 * Usage: node scripts/strip-base64-images.js
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

// Catalog JSON files to process (all that may contain product.image / product.media)
const CATALOG_FILES = [
  'products.json',
  'caza.json',
  'cocina.json',
];

let totalRemovedImages = 0;
let totalRemovedMedia = 0;

for (const filename of CATALOG_FILES) {
  const filepath = path.join(ROOT, filename);
  if (!fs.existsSync(filepath)) {
    console.log(`Skipping (not found): ${filename}`);
    continue;
  }

  const raw = fs.readFileSync(filepath, 'utf8');
  const data = JSON.parse(raw);

  const products = data.products ?? [];
  let removedImages = 0;
  let removedMedia = 0;

  for (const p of products) {
    if (typeof p.image === 'string' && p.image.startsWith('data:image/')) {
      p.image = '';
      removedImages++;
    }

    if (Array.isArray(p.media)) {
      const before = p.media.length;
      p.media = p.media.filter(
        m => !(m && typeof m.src === 'string' && m.src.startsWith('data:image/'))
      );
      removedMedia += before - p.media.length;
    }
  }

  fs.writeFileSync(filepath, JSON.stringify(data, null, 2) + '\n', 'utf8');

  console.log(`${filename}: removed ${removedImages} image(s), ${removedMedia} media entry(ies)`);
  totalRemovedImages += removedImages;
  totalRemovedMedia += removedMedia;
}

console.log(`\nTotal: ${totalRemovedImages} image(s), ${totalRemovedMedia} media entry(ies) removed`);
