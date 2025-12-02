/**
 * Comprehensive script to convert all title patterns in JSON files to structured format
 * 
 * Handles:
 * 1. "**Title**: Description..." → { title: "Title", description: "Description..." }
 * 2. "**Title**\n\nDescription..." → { title: "Title", description: "Description..." }
 * 3. "Title\n\nDescription..." → { title: "Title", description: "Description..." }
 *    (where title is a short sentence ending in optional punctuation)
 * 4. "Title: Description..." (where title is short, < 60 chars, starts with capital)
 * 
 * Usage: node scripts/convert-all-titles-to-structured.js
 */

const fs = require('fs');
const path = require('path');

// Pattern 1: **Title**: Description (with colon after bold)
const MARKDOWN_COLON_PATTERN = /^\*\*([^*]+)\*\*:\s*/;

// Pattern 2: **Title**\n\nDescription (bold title followed by double newline)
const MARKDOWN_NEWLINE_PATTERN = /^\*\*([^*]+)\*\*\s*\n\n/;

// Pattern 3: Title\n\nDescription (plain text title followed by double newline)
// Title must be < 80 chars and start with capital letter
const PLAIN_TITLE_NEWLINE_PATTERN = /^([A-Z][^\n]{3,75})\n\n/;

// Pattern 4: Title: Description (short title with colon, not markdown)
// Title must be < 60 chars, start with capital, no bold markers
const PLAIN_TITLE_COLON_PATTERN = /^([A-Z][^:\n*]{3,55}):\s+/;

let totalFilesProcessed = 0;
let totalFilesModified = 0;
let totalConversions = 0;
let conversionDetails = {
  markdownColon: 0,
  markdownNewline: 0,
  plainNewline: 0,
  plainColon: 0,
};

/**
 * Check if a string looks like a title (short, no complex formatting)
 */
function looksLikeTitle(text) {
  if (!text || text.length > 80) return false;
  if (text.includes('\n')) return false;
  // Should start with capital letter
  if (!/^[A-Z]/.test(text)) return false;
  // Should not be just a single word (too short)
  if (text.split(/\s+/).length < 2) return false;
  // Should not contain markdown or complex structures
  if (/\*\*|\[|`/.test(text)) return false;
  return true;
}

/**
 * Check if already has title/description structure
 */
function isAlreadyStructured(value) {
  return value && typeof value === 'object' && 
         value.hasOwnProperty('title') && 
         value.hasOwnProperty('description');
}

/**
 * Try to convert a string to structured format
 * Returns null if no conversion is possible
 */
function tryConvertString(value) {
  if (typeof value !== 'string') return null;
  if (value.length < 20) return null; // Too short to have title + description
  
  let match;
  let title;
  let description;
  let pattern;
  
  // Pattern 1: **Title**: Description
  match = value.match(MARKDOWN_COLON_PATTERN);
  if (match) {
    title = match[1].trim();
    description = value.slice(match[0].length).trim();
    if (title && description) {
      conversionDetails.markdownColon++;
      return { title, description };
    }
  }
  
  // Pattern 2: **Title**\n\nDescription
  match = value.match(MARKDOWN_NEWLINE_PATTERN);
  if (match) {
    title = match[1].trim();
    description = value.slice(match[0].length).trim();
    if (title && description) {
      conversionDetails.markdownNewline++;
      return { title, description };
    }
  }
  
  // Pattern 3: Title\n\nDescription (plain text)
  match = value.match(PLAIN_TITLE_NEWLINE_PATTERN);
  if (match && looksLikeTitle(match[1])) {
    title = match[1].trim();
    description = value.slice(match[0].length).trim();
    if (title && description && description.length > 50) {
      conversionDetails.plainNewline++;
      return { title, description };
    }
  }
  
  // Pattern 4: Title: Description (plain colon separator)
  // Only apply this if the string doesn't look like it starts with a complete sentence
  match = value.match(PLAIN_TITLE_COLON_PATTERN);
  if (match && looksLikeTitle(match[1])) {
    const potentialTitle = match[1].trim();
    // Make sure it's not something like "Note: blah" which is inline formatting
    // Title should be descriptive, not a single meta-word
    const singleWordMeta = ['note', 'warning', 'tip', 'example', 'important', 'watch'];
    if (!singleWordMeta.includes(potentialTitle.toLowerCase())) {
      title = potentialTitle;
      description = value.slice(match[0].length).trim();
      if (title && description && description.length > 50) {
        conversionDetails.plainColon++;
        return { title, description };
      }
    }
  }
  
  return null;
}

/**
 * Process an array, converting any convertible strings
 */
function processArray(arr) {
  let modified = false;
  const result = arr.map(item => {
    if (isAlreadyStructured(item)) {
      return item;
    }
    
    if (typeof item === 'string') {
      const converted = tryConvertString(item);
      if (converted) {
        modified = true;
        totalConversions++;
        return converted;
      }
      return item;
    }
    
    if (Array.isArray(item)) {
      const [processed, wasModified] = processArray(item);
      if (wasModified) modified = true;
      return processed;
    }
    
    if (item && typeof item === 'object') {
      const [processed, wasModified] = processObject(item);
      if (wasModified) modified = true;
      return processed;
    }
    
    return item;
  });
  return [result, modified];
}

/**
 * Process an object, converting any convertible strings in its values
 */
function processObject(obj) {
  let modified = false;
  const result = {};
  
  for (const [key, value] of Object.entries(obj)) {
    if (isAlreadyStructured(value)) {
      result[key] = value;
      continue;
    }
    
    if (typeof value === 'string') {
      const converted = tryConvertString(value);
      if (converted) {
        modified = true;
        totalConversions++;
        result[key] = converted;
      } else {
        result[key] = value;
      }
    } else if (Array.isArray(value)) {
      const [processed, wasModified] = processArray(value);
      if (wasModified) modified = true;
      result[key] = processed;
    } else if (value && typeof value === 'object') {
      const [processed, wasModified] = processObject(value);
      if (wasModified) modified = true;
      result[key] = processed;
    } else {
      result[key] = value;
    }
  }
  
  return [result, modified];
}

/**
 * Process a single JSON file
 */
function processFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    let data;
    
    try {
      data = JSON.parse(content);
    } catch (parseError) {
      console.error(`  Skipping ${filePath}: Invalid JSON`);
      return;
    }
    
    totalFilesProcessed++;
    
    let processed;
    let wasModified;
    
    if (Array.isArray(data)) {
      [processed, wasModified] = processArray(data);
    } else if (data && typeof data === 'object') {
      [processed, wasModified] = processObject(data);
    } else {
      return;
    }
    
    if (wasModified) {
      totalFilesModified++;
      const output = JSON.stringify(processed, null, 2);
      fs.writeFileSync(filePath, output, 'utf8');
      console.log(`  Modified: ${path.relative(process.cwd(), filePath)}`);
    }
  } catch (error) {
    console.error(`  Error processing ${filePath}: ${error.message}`);
  }
}

/**
 * Recursively find all JSON files in a directory
 */
function findJsonFiles(dir, files = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    // Skip node_modules and other irrelevant directories
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name === '.git') continue;
      findJsonFiles(fullPath, files);
    } else if (entry.isFile() && entry.name.endsWith('.json')) {
      files.push(fullPath);
    }
  }
  
  return files;
}

/**
 * Main execution
 */
function main() {
  const libDir = path.join(__dirname, '..', 'lib');
  
  console.log('='.repeat(70));
  console.log('Converting ALL title patterns to structured format');
  console.log('='.repeat(70));
  console.log(`\nScanning directory: ${libDir}\n`);
  
  if (!fs.existsSync(libDir)) {
    console.error(`Error: Directory not found: ${libDir}`);
    process.exit(1);
  }
  
  const jsonFiles = findJsonFiles(libDir);
  console.log(`Found ${jsonFiles.length} JSON files\n`);
  
  console.log('Processing files...\n');
  
  for (const file of jsonFiles) {
    processFile(file);
  }
  
  console.log('\n' + '='.repeat(70));
  console.log('Conversion Complete');
  console.log('='.repeat(70));
  console.log(`Files scanned:     ${totalFilesProcessed}`);
  console.log(`Files modified:    ${totalFilesModified}`);
  console.log(`Total conversions: ${totalConversions}`);
  console.log('\nConversion breakdown:');
  console.log(`  **Title**: Desc     ${conversionDetails.markdownColon}`);
  console.log(`  **Title**\\n\\nDesc  ${conversionDetails.markdownNewline}`);
  console.log(`  Title\\n\\nDesc      ${conversionDetails.plainNewline}`);
  console.log(`  Title: Desc         ${conversionDetails.plainColon}`);
  console.log('='.repeat(70));
}

main();

