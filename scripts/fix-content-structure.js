#!/usr/bin/env node
/**
 * Fix generated content files - normalize all object structures to strings
 */

const fs = require('fs');
const path = require('path');

const contentDir = path.join(__dirname, '../lib/content/generated');

function normalizeValue(val) {
  if (typeof val === 'string') return val;
  if (val && typeof val === 'object') {
    if (val.title && val.description) {
      return `**${val.title}** ${val.description}`;
    }
    if (val.title) return val.title;
    if (val.description) return val.description;
    if (val.advice) return val.advice;
    if (val.question && val.answer) {
      return val; // FAQs should stay as objects
    }
  }
  return String(val || '');
}

function normalizeSection(section) {
  return {
    heading: typeof section.heading === 'string' ? section.heading : (section.heading?.title || section.heading || ''),
    content: normalizeValue(section.content),
    subsections: section.subsections?.map(sub => ({
      heading: typeof sub.heading === 'string' ? sub.heading : (sub.heading?.title || ''),
      content: normalizeValue(sub.content)
    }))
  };
}

function fixFile(filePath) {
  try {
    const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    let modified = false;

    // Fix sections
    if (content.sections) {
      content.sections = content.sections.map(section => {
        const fixed = normalizeSection(section);
        if (JSON.stringify(fixed) !== JSON.stringify(section)) modified = true;
        return fixed;
      });
    }

    // Fix keyTakeaways - convert to strings
    if (content.keyTakeaways) {
      content.keyTakeaways = content.keyTakeaways.map(t => {
        const fixed = normalizeValue(t);
        if (fixed !== t) modified = true;
        return fixed;
      });
    }

    // Fix FAQs - ensure question/answer are strings
    if (content.faqs) {
      content.faqs = content.faqs.map(faq => {
        const fixed = {
          question: typeof faq.question === 'string' ? faq.question : normalizeValue(faq.question),
          answer: typeof faq.answer === 'string' ? faq.answer : normalizeValue(faq.answer)
        };
        if (JSON.stringify(fixed) !== JSON.stringify(faq)) modified = true;
        return fixed;
      });
    }

    if (modified) {
      fs.writeFileSync(filePath, JSON.stringify(content, null, 2));
      console.log(`Fixed: ${path.basename(filePath)}`);
      return true;
    }
    return false;
  } catch (err) {
    console.error(`Error processing ${filePath}:`, err.message);
    return false;
  }
}

// Process all directories
let fixed = 0;
['prism', 'mbti', 'enneagram'].forEach(dir => {
  const dirPath = path.join(contentDir, dir);
  if (fs.existsSync(dirPath)) {
    fs.readdirSync(dirPath).filter(f => f.endsWith('.json')).forEach(file => {
      if (fixFile(path.join(dirPath, file))) fixed++;
    });
  }
});

console.log(`\nFixed ${fixed} files`);




