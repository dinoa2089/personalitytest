#!/usr/bin/env node
/**
 * Analyze framework coverage in the question bank
 * Checks if we have enough questions for PRISM-7, MBTI, and Enneagram
 */

const fs = require('fs');
const path = require('path');

const questionsPath = path.join(__dirname, 'generated-questions-fixed.json');

if (!fs.existsSync(questionsPath)) {
  console.error('ERROR: generated-questions-fixed.json not found');
  process.exit(1);
}

const questions = JSON.parse(fs.readFileSync(questionsPath, 'utf-8'));

console.log('='.repeat(60));
console.log('FRAMEWORK COVERAGE ANALYSIS');
console.log('Total questions:', questions.length);
console.log('='.repeat(60));

// Count framework tags
const tagCounts = {};
questions.forEach(q => {
  (q.framework_tags || []).forEach(t => {
    tagCounts[t] = (tagCounts[t] || 0) + 1;
  });
});

// Count by primary dimension
const dimensionCounts = {};
questions.forEach(q => {
  dimensionCounts[q.dimension] = (dimensionCounts[q.dimension] || 0) + 1;
});

// PRISM-7 Analysis
console.log('\n[PRISM-7 DIMENSIONS]');
console.log('Requirements: 15+ questions per dimension for comprehensive assessment');
console.log('');

const prismDimensions = [
  'openness', 'conscientiousness', 'extraversion', 'agreeableness',
  'emotionalResilience', 'honestyHumility', 'adaptability'
];

let prismOk = true;
prismDimensions.forEach(dim => {
  const count = dimensionCounts[dim] || 0;
  const tagCount = tagCounts['prism_' + dim] || 0;
  const needed = 15;
  const status = count >= needed ? '[OK]' : '[NEED MORE]';
  if (count < needed) prismOk = false;
  console.log(`  ${status} ${dim}: ${count} questions (tagged: ${tagCount})`);
});

// MBTI Analysis
console.log('\n[MBTI DIMENSIONS]');
console.log('Requirements: 8+ questions per dimension for comprehensive assessment');
console.log('');

const mbtiDimensions = ['mbti_ei', 'mbti_sn', 'mbti_tf', 'mbti_jp'];
const mbtiNames = {
  'mbti_ei': 'Extraversion/Introversion',
  'mbti_sn': 'Sensing/iNtuition',
  'mbti_tf': 'Thinking/Feeling',
  'mbti_jp': 'Judging/Perceiving'
};

let mbtiOk = true;
let mbtiMissing = [];
mbtiDimensions.forEach(dim => {
  const count = tagCounts[dim] || 0;
  const needed = 8;
  const status = count >= needed ? '[OK]' : '[NEED MORE]';
  if (count < needed) {
    mbtiOk = false;
    mbtiMissing.push({ dim, count, needed: needed - count });
  }
  console.log(`  ${status} ${dim} (${mbtiNames[dim]}): ${count} questions`);
});

// Enneagram Analysis
console.log('\n[ENNEAGRAM TYPES]');
console.log('Requirements: 3+ questions per type for comprehensive assessment');
console.log('');

let ennOk = true;
let ennMissing = [];
for (let i = 1; i <= 9; i++) {
  const tag = 'enneagram_' + i;
  const count = tagCounts[tag] || 0;
  const needed = 3;
  const status = count >= needed ? '[OK]' : '[NEED MORE]';
  if (count < needed) {
    ennOk = false;
    ennMissing.push({ type: i, count, needed: needed - count });
  }
  console.log(`  ${status} Type ${i}: ${count} questions`);
}

// Summary
console.log('\n' + '='.repeat(60));
console.log('SUMMARY');
console.log('='.repeat(60));

console.log('\nPRISM-7:', prismOk ? 'COMPLETE' : 'NEEDS MORE QUESTIONS');
console.log('MBTI:', mbtiOk ? 'COMPLETE' : 'NEEDS MORE QUESTIONS');
console.log('Enneagram:', ennOk ? 'COMPLETE' : 'NEEDS MORE QUESTIONS');

// Recommendations
if (!mbtiOk || !ennOk) {
  console.log('\n' + '='.repeat(60));
  console.log('RECOMMENDATIONS');
  console.log('='.repeat(60));
  
  if (!mbtiOk) {
    console.log('\nMBTI needs more tagged questions:');
    mbtiMissing.forEach(m => {
      console.log(`  - ${m.dim}: need ${m.needed} more questions`);
    });
    console.log('\nNote: PRISM dimensions map to MBTI:');
    console.log('  - extraversion -> mbti_ei');
    console.log('  - openness -> mbti_sn (intuition)');
    console.log('  - agreeableness -> mbti_tf (feeling)');
    console.log('  - conscientiousness -> mbti_jp (judging)');
  }
  
  if (!ennOk) {
    console.log('\nEnneagram needs more tagged questions:');
    ennMissing.forEach(m => {
      console.log(`  - Type ${m.type}: need ${m.needed} more questions`);
    });
  }
  
  console.log('\nOptions to fix:');
  console.log('1. Add framework_tags to existing questions that relate to these dimensions');
  console.log('2. Generate new questions specifically for missing frameworks');
  console.log('3. Use the cross-framework inference (PRISM -> MBTI/Enneagram mapping)');
}


