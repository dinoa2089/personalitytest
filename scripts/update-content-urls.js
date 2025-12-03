/**
 * Generate updated content files with Supabase URLs
 * This will output the URL mappings that need to be added to the content files
 */

const fs = require('fs');
const path = require('path');

// Load the image URLs
const imageUrls = JSON.parse(fs.readFileSync(path.join(__dirname, 'image-urls.json')));

const SUPABASE_BASE = 'https://eqkcmlxxuubibzoqliee.supabase.co/storage/v1/object/public/famous-images';

// Helper to convert name to ID
function nameToId(name) {
  return name.toLowerCase()
    .replace(/['']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

// Map of names to their Supabase image URLs
const nameToUrl = {};

// Build reverse mapping from IDs we have
Object.entries(imageUrls).forEach(([id, url]) => {
  nameToUrl[id] = url;
});

// Common name variations
const nameVariants = {
  'mr-rogers': ['fred-rogers', 'mr-rogers', 'fred-rogers-harmonizer'],
  'q': ['q-bond'],
  'the-rock': ['dwayne-johnson'],
  'rbg': ['ruth-bader-ginsburg'],
  'mlk': ['martin-luther-king-jr'],
  'fdr': ['franklin-d-roosevelt'],
};

console.log('=== IMAGE URL MAPPING ===\n');
console.log(`Total images available: ${Object.keys(imageUrls).length}\n`);

// List all available IDs
console.log('Available image IDs:');
Object.keys(imageUrls).sort().forEach(id => {
  console.log(`  ${id}`);
});

console.log('\n=== USAGE ===\n');
console.log('To use in content files, reference images like:');
console.log(`const SUPABASE_IMG = "${SUPABASE_BASE}";`);
console.log('image_url: `${SUPABASE_IMG}/person-id.jpg`');



