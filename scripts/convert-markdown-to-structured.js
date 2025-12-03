/**
 * Script to convert markdown **title** patterns in JSON files to structured format
 * 
 * Converts: "**Title**: Description text..."
 * To: { "title": "Title", "description": "Description text..." }
 * 
 * Usage: node scripts/convert-markdown-to-structured.js
 */

const fs = require('fs');
const path = require('path');

// Pattern to match **title**: or **title** at the start of a string
// Handles variations like **Title**: **Title** (colon optional)
const MARKDOWN_TITLE_PATTERN = /^\*\*([^*]+)\*\*:?\s*/;

// Additional pattern for titles with just bold (no colon)
const BOLD_ONLY_PATTERN = /^\*\*([^*]+)\*\*/;

let totalFilesProcessed = 0;
let totalFilesModified = 0;
let totalConversions = 0;

/**
 * Check if a value is a string that starts with markdown **title** pattern
 */
function hasMarkdownTitle(value) {
  if (typeof value !== 'string') return false;
  return MARKDOWN_TITLE_PATTERN.test(value);
}

/**
 * Convert a markdown string to structured format
 * Returns the original if no conversion is needed
 */
function convertMarkdownString(value) {
  if (typeof value !== 'string') return value;
  
  const match = value.match(MARKDOWN_TITLE_PATTERN);
  if (!match) return value;
  
  const title = match[1].trim();
  const description = value.slice(match[0].length).trim();
  
  return {
    title,
    description
  };
}

/**
 * Process an array, converting any markdown strings to structured format
 */
function processArray(arr) {
  let modified = false;
  const result = arr.map(item => {
    if (typeof item === 'string' && hasMarkdownTitle(item)) {
      modified = true;
      totalConversions++;
      return convertMarkdownString(item);
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
 * Process an object, converting any markdown strings in its values
 */
function processObject(obj) {
  let modified = false;
  const result = {};
  
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string' && hasMarkdownTitle(value)) {
      modified = true;
      totalConversions++;
      result[key] = convertMarkdownString(value);
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
      console.log(`  Modified: ${filePath}`);
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
  
  console.log('='.repeat(60));
  console.log('Converting markdown **title** patterns to structured format');
  console.log('='.repeat(60));
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
  
  console.log('\n' + '='.repeat(60));
  console.log('Conversion Complete');
  console.log('='.repeat(60));
  console.log(`Files scanned:   ${totalFilesProcessed}`);
  console.log(`Files modified:  ${totalFilesModified}`);
  console.log(`Total conversions: ${totalConversions}`);
  console.log('='.repeat(60));
}

main();



