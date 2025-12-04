/**
 * Analyze all content files and find missing/mismatched images
 * Compares names in content files against what we have in Supabase
 */

const fs = require('fs');
const path = require('path');

// Load existing image URLs
const imageUrls = require('./image-urls.json');
const existingIds = new Set(Object.keys(imageUrls));

// Helper to convert name to ID (same logic as components)
function nameToId(name) {
  return name.toLowerCase()
    .replace(/['']/g, '')
    .replace(/\s*\/\s*/g, '-')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

// Extract names from TypeScript content (simplified parsing)
function extractNamesFromFile(filePath, pattern) {
  const content = fs.readFileSync(filePath, 'utf8');
  const names = [];
  const regex = new RegExp(pattern, 'g');
  let match;
  while ((match = regex.exec(content)) !== null) {
    names.push(match[1]);
  }
  return names;
}

console.log('=== ANALYZING MISSING IMAGES ===\n');

// 1. PRISM Archetypes
console.log('📦 PRISM Archetypes (archetype-examples.ts):');
const archetypeContent = fs.readFileSync(path.join(__dirname, '../lib/archetype-examples.ts'), 'utf8');
const archetypeNames = [];
const nameRegex = /name:\s*["']([^"']+)["']/g;
let match;
while ((match = nameRegex.exec(archetypeContent)) !== null) {
  archetypeNames.push(match[1]);
}

const archetypeMissing = [];
archetypeNames.forEach(name => {
  const id = nameToId(name);
  if (!existingIds.has(id)) {
    // Check common variations
    const variations = [
      id,
      id.split('-')[0], // First name only
      id.replace(/-/g, ''), // No dashes
    ];
    const found = variations.some(v => existingIds.has(v));
    if (!found) {
      archetypeMissing.push({ name, expectedId: id });
    }
  }
});

console.log(`  Total names: ${archetypeNames.length}`);
console.log(`  Missing: ${archetypeMissing.length}`);
if (archetypeMissing.length > 0) {
  archetypeMissing.forEach(m => console.log(`    ❌ "${m.name}" (expected: ${m.expectedId})`));
}

// 2. MBTI Content
console.log('\n📦 MBTI Content (mbti-content.ts):');
const mbtiContent = fs.readFileSync(path.join(__dirname, '../lib/mbti-content.ts'), 'utf8');
const mbtiNames = [];
const mbtiNameRegex = /{\s*name:\s*["']([^"']+)["'],\s*known_for:/g;
while ((match = mbtiNameRegex.exec(mbtiContent)) !== null) {
  mbtiNames.push(match[1]);
}

const mbtiMissing = [];
const mbtiFound = [];
mbtiNames.forEach(name => {
  const id = nameToId(name);
  if (existingIds.has(id)) {
    mbtiFound.push({ name, id });
  } else {
    mbtiMissing.push({ name, expectedId: id });
  }
});

console.log(`  Total names: ${mbtiNames.length}`);
console.log(`  Found in Supabase: ${mbtiFound.length}`);
console.log(`  Missing: ${mbtiMissing.length}`);
if (mbtiMissing.length > 0) {
  console.log('  Missing names:');
  mbtiMissing.forEach(m => console.log(`    ❌ "${m.name}" (expected: ${m.expectedId})`));
}

// 3. Enneagram Content
console.log('\n📦 Enneagram Content (enneagram-content.ts):');
const enneagramContent = fs.readFileSync(path.join(__dirname, '../lib/enneagram-content.ts'), 'utf8');
const enneagramNames = [];
const enneagramNameRegex = /{\s*name:\s*["']([^"']+)["'],\s*known_for:/g;
while ((match = enneagramNameRegex.exec(enneagramContent)) !== null) {
  enneagramNames.push(match[1]);
}

const enneagramMissing = [];
const enneagramFound = [];
enneagramNames.forEach(name => {
  const id = nameToId(name);
  if (existingIds.has(id)) {
    enneagramFound.push({ name, id });
  } else {
    enneagramMissing.push({ name, expectedId: id });
  }
});

console.log(`  Total names: ${enneagramNames.length}`);
console.log(`  Found in Supabase: ${enneagramFound.length}`);
console.log(`  Missing: ${enneagramMissing.length}`);
if (enneagramMissing.length > 0) {
  console.log('  Missing names:');
  enneagramMissing.forEach(m => console.log(`    ❌ "${m.name}" (expected: ${m.expectedId})`));
}

// Summary
console.log('\n=== SUMMARY ===');
const allMissing = [...new Set([...archetypeMissing, ...mbtiMissing, ...enneagramMissing].map(m => m.name))];
console.log(`Total unique missing: ${allMissing.length}`);

// Generate mapping for found images
console.log('\n=== GENERATING URL MAPPING ===');
const SUPABASE_BASE = 'https://eqkcmlxxuubibzoqliee.supabase.co/storage/v1/object/public/famous-images';

const allNames = [...new Set([...archetypeNames, ...mbtiNames, ...enneagramNames])];
const mapping = {};

allNames.forEach(name => {
  const id = nameToId(name);
  if (imageUrls[id]) {
    mapping[name] = imageUrls[id];
  }
});

console.log(`Mapped ${Object.keys(mapping).length} of ${allNames.length} names to Supabase URLs`);

// Write mapping file
const mappingContent = `// Auto-generated image URL mapping
// Maps exact names from content files to Supabase URLs

export const imageUrlMap: Record<string, string> = ${JSON.stringify(mapping, null, 2)};

export function getImageUrl(name: string): string | undefined {
  return imageUrlMap[name];
}
`;

fs.writeFileSync(path.join(__dirname, '../lib/image-urls.ts'), mappingContent);
console.log('\n✅ Generated lib/image-urls.ts');

// Write list of missing for upload
const missingForUpload = [...new Set([...archetypeMissing, ...mbtiMissing, ...enneagramMissing].map(m => JSON.stringify(m)))].map(s => JSON.parse(s));
fs.writeFileSync(path.join(__dirname, 'missing-images.json'), JSON.stringify(missingForUpload, null, 2));
console.log(`✅ Wrote ${missingForUpload.length} missing images to scripts/missing-images.json`);




