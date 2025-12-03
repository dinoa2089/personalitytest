/**
 * Sync mock-questions.ts with the Supabase database
 * Run: node scripts/sync-mock-questions.js
 */

const fs = require('fs');
const path = require('path');

// Read the exported questions from the database
const exportPath = path.join(__dirname, '../questions_export_after.json');
const data = JSON.parse(fs.readFileSync(exportPath, 'utf8'));

// Generate the mock-questions.ts file
const questions = data.questions.map(q => {
  const base = {
    id: q.id,
    text: q.text,
    type: q.type,
    dimension: q.dimension,
    reverse_scored: q.reverse_scored || false,
    weight: q.weight || 1,
    discrimination: q.discrimination || 1,
    framework_tags: q.framework_tags || [`prism_${q.dimension}`],
  };
  
  // Add options for forced_choice and situational_judgment
  if (q.options && q.options.length > 0) {
    base.options = q.options;
  }
  
  return base;
});

// Generate TypeScript file content
const tsContent = `/**
 * Mock question data for development/testing when Supabase is not available
 * Auto-generated from database export on ${new Date().toISOString().split('T')[0]}
 * Run: node scripts/sync-mock-questions.js to regenerate
 */
import type { Question, ForcedChoiceOption } from "@/types";

export const mockQuestions: Question[] = ${JSON.stringify(questions, null, 2)};
`;

// Write to mock-questions.ts
const outputPath = path.join(__dirname, '../lib/mock-questions.ts');
fs.writeFileSync(outputPath, tsContent);

console.log(`✅ Synced ${questions.length} questions to mock-questions.ts`);
console.log(`   - Likert: ${questions.filter(q => q.type === 'likert').length}`);
console.log(`   - Forced Choice: ${questions.filter(q => q.type === 'forced_choice').length}`);
console.log(`   - Situational Judgment: ${questions.filter(q => q.type === 'situational_judgment').length}`);
console.log(`   - Behavioral Frequency: ${questions.filter(q => q.type === 'behavioral_frequency').length}`);
console.log(`   - With MBTI tags: ${questions.filter(q => q.framework_tags?.some(t => t.startsWith('mbti_'))).length}`);
console.log(`   - With Enneagram tags: ${questions.filter(q => q.framework_tags?.some(t => t.startsWith('enneagram_'))).length}`);

