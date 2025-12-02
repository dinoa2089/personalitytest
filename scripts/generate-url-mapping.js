/**
 * Generate comprehensive URL mapping with manual fixes
 */

const fs = require('fs');
const path = require('path');

const imageUrls = require('./image-urls.json');
const SUPABASE_BASE = 'https://eqkcmlxxuubibzoqliee.supabase.co/storage/v1/object/public/famous-images';

// Manual overrides for names that don't match automatically
const manualMappings = {
  // PRISM characters with "/" in names
  "Tony Stark / Iron Man": "tony-stark",
  "Bruce Wayne / Batman": "batman",
  "Star-Lord / Peter Quill": "star-lord",
  "Captain America / Steve Rogers": "captain-america",
  "Professor X / Charles Xavier": "professor-x",
  "T'Challa / Black Panther": "tchalla",
  "Captain Jack Sparrow": "jack-sparrow",
  
  // Special characters and apostrophes
  "Beyoncé": "beyonce",
  "Brené Brown": "brene-brown",
  "Amélie Poulain": "amelie",
  "Céline Dion": "celine-dion",
  "Sandra Day O'Connor": "sandra-day-oconnor",
  "King T'Chaka": "king-tchaka",
  "Louis C.K.": "louis-c-k",
  
  // Alternate names
  "Q": "q-bond",
  "Data": "data-tng",
  "Vision": "vision-mcu",
  "Muhammad Ali": "muhammed-ali",
  "Prince Charles": "king-charles",
  "Captain Picard": "jean-luc-picard",
  "Mr. Rogers": "fred-rogers",
  "Conan O'Brien": "conan-obrien",
  "Gary Larson": null, // No image available - famously private
};

// Get all existing IDs from Supabase
const existingIds = Object.keys(imageUrls);

// Helper to convert name to ID
function nameToId(name) {
  return name.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/['']/g, '')
    .replace(/\s*\/\s*/g, '-')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

// Find best match for a name
function findBestMatch(name) {
  // Check manual mapping first
  if (name in manualMappings) {
    const id = manualMappings[name];
    if (id === null) return null; // Explicitly no image
    if (imageUrls[id]) {
      return imageUrls[id];
    }
  }
  
  // Try direct conversion
  const id = nameToId(name);
  if (imageUrls[id]) {
    return imageUrls[id];
  }
  
  // Try first name only (for "Tony Stark / Iron Man" -> "tony-stark")
  const firstName = id.split('-').slice(0, 2).join('-');
  if (imageUrls[firstName]) {
    return imageUrls[firstName];
  }
  
  // Try without suffix (for character names)
  const parts = name.split(' / ');
  if (parts.length > 1) {
    const charId = nameToId(parts[0]);
    if (imageUrls[charId]) {
      return imageUrls[charId];
    }
    const heroId = nameToId(parts[1]);
    if (imageUrls[heroId]) {
      return imageUrls[heroId];
    }
  }
  
  return null;
}

// Extract all names from content files
const archetypeContent = fs.readFileSync(path.join(__dirname, '../lib/archetype-examples.ts'), 'utf8');
const mbtiContent = fs.readFileSync(path.join(__dirname, '../lib/mbti-content.ts'), 'utf8');
const enneagramContent = fs.readFileSync(path.join(__dirname, '../lib/enneagram-content.ts'), 'utf8');

// Use regex that handles both single and double quotes, and apostrophes in names
const nameRegex = /name:\s*"([^"]+)"/g;
const allNames = new Set();

let match;
while ((match = nameRegex.exec(archetypeContent)) !== null) allNames.add(match[1]);

// For MBTI/Enneagram, match the pattern with known_for
const mbtiNameRegex = /{\s*name:\s*"([^"]+)",\s*known_for:/g;
while ((match = mbtiNameRegex.exec(mbtiContent)) !== null) allNames.add(match[1]);

const enneagramNameRegex = /{\s*name:\s*"([^"]+)",\s*known_for:/g;
while ((match = enneagramNameRegex.exec(enneagramContent)) !== null) allNames.add(match[1]);

console.log(`Found ${allNames.size} unique names`);

// Generate mapping
const mapping = {};
const missing = [];

allNames.forEach(name => {
  const url = findBestMatch(name);
  if (url) {
    mapping[name] = url;
  } else {
    missing.push(name);
  }
});

console.log(`Mapped: ${Object.keys(mapping).length}`);
console.log(`Still missing: ${missing.length}`);

if (missing.length > 0) {
  console.log('\nMissing names:');
  missing.forEach(n => console.log(`  - ${n}`));
}

// Generate TypeScript file
const tsContent = `// Auto-generated image URL mapping
// Maps exact names from content files to Supabase URLs
// Generated: ${new Date().toISOString()}

const SUPABASE_IMG = "https://eqkcmlxxuubibzoqliee.supabase.co/storage/v1/object/public/famous-images";

export const imageUrlMap: Record<string, string> = {
${Object.entries(mapping).map(([name, url]) => `  "${name.replace(/"/g, '\\"')}": "${url}"`).join(',\n')}
};

// Fallback function that tries to construct URL from name
function nameToImageId(name: string): string {
  return name.toLowerCase()
    .normalize('NFD').replace(/[\\u0300-\\u036f]/g, '')
    .replace(/['']/g, '')
    .replace(/\\s*\\/\\s*/g, '-')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export function getImageUrl(name: string): string | undefined {
  // First check exact mapping
  if (imageUrlMap[name]) {
    return imageUrlMap[name];
  }
  
  // Fallback: try to construct URL
  const id = nameToImageId(name);
  return \`\${SUPABASE_IMG}/\${id}.jpg\`;
}
`;

fs.writeFileSync(path.join(__dirname, '../lib/image-urls.ts'), tsContent);
console.log('\n✅ Generated lib/image-urls.ts');

// Save missing for upload
fs.writeFileSync(path.join(__dirname, 'still-missing.json'), JSON.stringify(missing, null, 2));
console.log(`✅ Saved ${missing.length} missing names to scripts/still-missing.json`);

