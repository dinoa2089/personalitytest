#!/usr/bin/env node
/**
 * Fix Duplicate Questions Script
 * 
 * This script:
 * 1. Reads the generated-questions.json file
 * 2. Gives unique, contextual text to forced-choice questions
 * 3. Identifies and removes/flags truly duplicate questions
 * 4. Outputs a cleaned question bank
 * 
 * Run with: node scripts/fix-duplicate-questions.js
 */

const fs = require('fs');
const path = require('path');

const inputPath = path.join(__dirname, 'generated-questions.json');
const outputPath = path.join(__dirname, 'generated-questions-fixed.json');

function main() {
  console.log('🔧 Fixing duplicate questions...\n');

  // Read the generated questions
  if (!fs.existsSync(inputPath)) {
    console.error('❌ generated-questions.json not found');
    process.exit(1);
  }

  const questions = JSON.parse(fs.readFileSync(inputPath, 'utf-8'));
  console.log(`📋 Loaded ${questions.length} questions\n`);

  // Track unique texts
  const seenTexts = new Map(); // text -> first question index
  const duplicates = [];
  const fixedQuestions = [];

  let forcedChoiceCount = 0;

  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
    const normalizedText = q.text.toLowerCase().trim();

    // Check if this is a forced-choice question with generic text
    if (q.type === 'forced_choice' && 
        normalizedText.includes('which is most like you')) {
      forcedChoiceCount++;
      
      // Create unique contextual text based on the options
      const options = q.options || [];
      const optionTexts = options.map(o => 
        typeof o === 'string' ? o : o.text
      ).filter(Boolean);
      
      // Extract key themes from options
      const themes = extractThemes(optionTexts);
      const contextualText = generateContextualText(themes, q.dimension, forcedChoiceCount);
      
      fixedQuestions.push({
        ...q,
        text: contextualText,
        original_text: q.text, // Preserve original for reference
      });
      
      console.log(`✓ Fixed forced-choice #${forcedChoiceCount}:`);
      console.log(`  Old: "${q.text.substring(0, 50)}..."`);
      console.log(`  New: "${contextualText}"`);
      console.log('');
    }
    // Check for duplicate text
    else if (seenTexts.has(normalizedText)) {
      duplicates.push({
        index: i,
        text: q.text,
        firstSeenIndex: seenTexts.get(normalizedText),
      });
      console.log(`⚠️  Duplicate found at index ${i}: "${q.text.substring(0, 60)}..."`);
    }
    // Unique question - keep it
    else {
      seenTexts.set(normalizedText, i);
      fixedQuestions.push(q);
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('📊 SUMMARY');
  console.log('='.repeat(60));
  console.log(`Original questions: ${questions.length}`);
  console.log(`Forced-choice questions fixed: ${forcedChoiceCount}`);
  console.log(`True duplicates removed: ${duplicates.length}`);
  console.log(`Final question count: ${fixedQuestions.length}`);

  // Write fixed questions
  fs.writeFileSync(outputPath, JSON.stringify(fixedQuestions, null, 2));
  console.log(`\n✅ Fixed questions saved to: ${outputPath}`);

  // Write duplicates report
  if (duplicates.length > 0) {
    const reportPath = path.join(__dirname, 'duplicates-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(duplicates, null, 2));
    console.log(`📝 Duplicates report saved to: ${reportPath}`);
  }

  console.log('\n🎉 Done! Review the fixed questions before seeding to database.');
}

/**
 * Extract key themes from option texts
 */
function extractThemes(optionTexts) {
  const themes = [];
  
  const themeKeywords = {
    creativity: ['creative', 'innovate', 'new ideas', 'experiment', 'unconventional'],
    organization: ['organized', 'plan', 'detail', 'structure', 'schedule'],
    social: ['people', 'social', 'conversation', 'group', 'team', 'collaborate'],
    leadership: ['lead', 'initiative', 'charge', 'direct', 'manage'],
    empathy: ['help', 'support', 'others', 'care', 'compassion', 'needs'],
    stability: ['calm', 'pressure', 'stress', 'stable', 'composed'],
    honesty: ['honest', 'fair', 'integrity', 'true', 'authentic'],
    flexibility: ['adapt', 'change', 'flexible', 'adjust', 'pivot'],
    analytical: ['analyze', 'think', 'reason', 'logic', 'systematic'],
    independence: ['independent', 'alone', 'self', 'autonomous'],
  };

  const combinedText = optionTexts.join(' ').toLowerCase();
  
  for (const [theme, keywords] of Object.entries(themeKeywords)) {
    for (const keyword of keywords) {
      if (combinedText.includes(keyword)) {
        themes.push(theme);
        break;
      }
    }
  }

  return [...new Set(themes)].slice(0, 3); // Return up to 3 unique themes
}

/**
 * Generate contextual text for forced-choice question
 */
function generateContextualText(themes, dimension, index) {
  // Dimension-specific context starters
  const dimensionContexts = {
    openness: [
      'When exploring new ideas and experiences',
      'Regarding your intellectual curiosity',
      'When it comes to creativity and innovation',
      'Thinking about how you approach novelty',
      'When considering different perspectives',
    ],
    conscientiousness: [
      'When organizing your work and responsibilities',
      'Regarding your approach to planning and goals',
      'When it comes to completing tasks and commitments',
      'Thinking about your work habits',
      'When managing deadlines and priorities',
    ],
    extraversion: [
      'In social situations',
      'When interacting with others',
      'Regarding your energy in group settings',
      'When meeting new people',
      'Thinking about how you engage with others',
    ],
    agreeableness: [
      'When working with others',
      'Regarding how you handle disagreements',
      'When balancing your needs with others\' needs',
      'Thinking about cooperation and harmony',
      'When responding to others\' perspectives',
    ],
    emotionalResilience: [
      'When facing challenges or setbacks',
      'Regarding how you handle stress',
      'When dealing with difficult emotions',
      'Thinking about your response to pressure',
      'When recovering from disappointments',
    ],
    honestyHumility: [
      'When it comes to integrity and fairness',
      'Regarding how you present yourself',
      'When balancing personal gain with ethics',
      'Thinking about honesty and authenticity',
      'When giving credit and acknowledging others',
    ],
    adaptability: [
      'When circumstances change unexpectedly',
      'Regarding your flexibility and openness to change',
      'When facing new or ambiguous situations',
      'Thinking about how you adjust your approach',
      'When your plans need to shift',
    ],
  };

  const contexts = dimensionContexts[dimension] || dimensionContexts.openness;
  const contextIndex = (index - 1) % contexts.length;
  const context = contexts[contextIndex];

  // Theme-based additions
  let themeAddition = '';
  if (themes.length > 0) {
    const themeDescriptions = {
      creativity: 'especially around creativity',
      organization: 'particularly with organization',
      social: 'in social contexts',
      leadership: 'in leadership situations',
      empathy: 'regarding helping others',
      stability: 'under pressure',
      honesty: 'concerning integrity',
      flexibility: 'when adapting',
      analytical: 'with analysis',
      independence: 'working independently',
    };
    const themeDesc = themeDescriptions[themes[0]];
    if (themeDesc) {
      themeAddition = ` ${themeDesc}`;
    }
  }

  return `${context}${themeAddition}, which is MOST like you and which is LEAST like you?`;
}

main();


