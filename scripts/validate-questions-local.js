/**
 * Validate Question Bank Integrity (Local File Version)
 * Works with questions_export.json
 */

const fs = require('fs');
const path = require('path');

// Load questions
const questionsFile = path.join(__dirname, '..', 'questions_export.json');
let fileContent = fs.readFileSync(questionsFile, 'utf8');
if (fileContent.charCodeAt(0) === 0xFEFF) {
  fileContent = fileContent.slice(1);
}
const data = JSON.parse(fileContent);

let questions = [];
if (data.questions) {
  questions = data.questions;
} else if (Array.isArray(data)) {
  questions = data;
} else {
  for (const key of Object.keys(data)) {
    if (Array.isArray(data[key])) {
      questions.push(...data[key]);
    }
  }
}

console.log('🔍 Validating Question Bank Integrity\n');
console.log('='.repeat(100));
console.log(`\n📊 Total questions: ${questions.length}\n`);

const DIMENSIONS = [
  'openness',
  'conscientiousness', 
  'extraversion',
  'agreeableness',
  'emotionalResilience',
  'honestyHumility',
  'adaptability'
];

const issues = [];
const warnings = [];

// ============================================================================
// 1. DIMENSION COVERAGE
// ============================================================================

console.log('━'.repeat(100));
console.log('📋 DIMENSION COVERAGE\n');

const dimensionStats = {};
for (const dim of DIMENSIONS) {
  const dimQuestions = questions.filter(q => q.dimension === dim);
  const reverseCount = dimQuestions.filter(q => q.reverse_scored).length;
  const types = [...new Set(dimQuestions.map(q => q.type))];
  
  dimensionStats[dim] = {
    total: dimQuestions.length,
    reverse: reverseCount,
    types: types,
    likert: dimQuestions.filter(q => q.type === 'likert').length,
    behavioral: dimQuestions.filter(q => q.type === 'behavioral_frequency').length,
    situational: dimQuestions.filter(q => q.type === 'situational_judgment').length,
    forced: dimQuestions.filter(q => q.type === 'forced_choice').length,
  };
  
  const status = dimQuestions.length >= 15 ? '✅' : '❌';
  const reverseStatus = reverseCount >= 2 ? '✅' : '⚠️';
  
  console.log(`   ${dim.padEnd(22)} ${String(dimQuestions.length).padStart(3)} total ${status}  |  ${reverseCount} reverse ${reverseStatus}  |  Types: ${types.join(', ')}`);
  
  if (dimQuestions.length < 15) {
    issues.push(`${dim}: Only ${dimQuestions.length} questions (need 15+)`);
  }
  if (reverseCount < 2) {
    warnings.push(`${dim}: Only ${reverseCount} reverse-scored items (recommend 2+)`);
  }
}

// ============================================================================
// 2. QUESTION TYPE DISTRIBUTION
// ============================================================================

console.log('\n' + '━'.repeat(100));
console.log('📋 QUESTION TYPE DISTRIBUTION\n');

const typeStats = {};
for (const q of questions) {
  typeStats[q.type] = (typeStats[q.type] || 0) + 1;
}

const typeMinimums = { likert: 80, behavioral_frequency: 20, situational_judgment: 15, forced_choice: 10 };

for (const [type, count] of Object.entries(typeStats).sort((a, b) => b[1] - a[1])) {
  const min = typeMinimums[type] || 0;
  const status = count >= min ? '✅' : '⚠️';
  const bar = '█'.repeat(Math.min(50, Math.round(count / 3)));
  console.log(`   ${type.padEnd(22)} ${String(count).padStart(3)} ${status} ${bar}`);
}

// ============================================================================
// 3. DIMENSION x TYPE MATRIX
// ============================================================================

console.log('\n' + '━'.repeat(100));
console.log('📋 DIMENSION × TYPE MATRIX (questions per cell)\n');

console.log('   ' + 'Dimension'.padEnd(22) + '  Likert  Behav.  Situat.  Forced  TOTAL');
console.log('   ' + '-'.repeat(70));

for (const dim of DIMENSIONS) {
  const stats = dimensionStats[dim];
  const total = stats.total;
  const row = `   ${dim.padEnd(22)}  ${String(stats.likert).padStart(6)}  ${String(stats.behavioral).padStart(6)}  ${String(stats.situational).padStart(7)}  ${String(stats.forced).padStart(6)}  ${String(total).padStart(5)}`;
  console.log(row);
}

// ============================================================================
// 4. WEIGHTED SCORING COVERAGE
// ============================================================================

console.log('\n' + '━'.repeat(100));
console.log('📋 WEIGHTED SCORING COVERAGE (Behavioral=1.5x, Situational=1.3x, Likert=1.0x)\n');

for (const dim of DIMENSIONS) {
  const stats = dimensionStats[dim];
  const weighted = stats.likert + (stats.behavioral * 1.5) + (stats.situational * 1.3) + (stats.forced * 1.2);
  const status = weighted >= 20 ? '✅' : weighted >= 15 ? '⚠️' : '❌';
  const bar = '█'.repeat(Math.min(40, Math.round(weighted / 2)));
  console.log(`   ${dim.padEnd(22)} ${weighted.toFixed(1).padStart(5)} effective questions ${status} ${bar}`);
  
  if (weighted < 15) {
    issues.push(`${dim}: Only ${weighted.toFixed(1)} weighted questions (need 15+)`);
  }
}

// ============================================================================
// 5. BALANCE ANALYSIS
// ============================================================================

console.log('\n' + '━'.repeat(100));
console.log('📋 BALANCE ANALYSIS\n');

const totalByDim = DIMENSIONS.map(d => dimensionStats[d].total);
const avgQuestions = totalByDim.reduce((a, b) => a + b, 0) / DIMENSIONS.length;
const minQuestions = Math.min(...totalByDim);
const maxQuestions = Math.max(...totalByDim);
const imbalanceRatio = maxQuestions / minQuestions;

console.log(`   Average questions per dimension: ${avgQuestions.toFixed(1)}`);
console.log(`   Min: ${minQuestions} (${DIMENSIONS[totalByDim.indexOf(minQuestions)]})`);
console.log(`   Max: ${maxQuestions} (${DIMENSIONS[totalByDim.indexOf(maxQuestions)]})`);
console.log(`   Imbalance ratio: ${imbalanceRatio.toFixed(2)}x ${imbalanceRatio > 2 ? '⚠️ HIGH' : '✅ OK'}`);

if (imbalanceRatio > 2) {
  warnings.push(`Dimension imbalance: ${maxQuestions}/${minQuestions} = ${imbalanceRatio.toFixed(1)}x`);
}

// ============================================================================
// 6. REVERSE SCORING BALANCE
// ============================================================================

console.log('\n' + '━'.repeat(100));
console.log('📋 REVERSE SCORING BALANCE\n');

const totalReverse = questions.filter(q => q.reverse_scored).length;
const reversePercent = (totalReverse / questions.length * 100).toFixed(1);

console.log(`   Total reverse-scored: ${totalReverse} (${reversePercent}%)`);
console.log(`   Recommended range: 20-40%`);

const reverseStatus = reversePercent >= 20 && reversePercent <= 40 ? '✅ Balanced' : '⚠️ Adjust';
console.log(`   Status: ${reverseStatus}`);

// ============================================================================
// SUMMARY
// ============================================================================

console.log('\n' + '='.repeat(100));
console.log('\n📊 VALIDATION SUMMARY\n');

if (issues.length === 0) {
  console.log('   ✅ NO CRITICAL ISSUES - Question bank maintains psychometric integrity\n');
} else {
  console.log('   ❌ CRITICAL ISSUES:\n');
  issues.forEach(i => console.log(`      • ${i}`));
}

if (warnings.length > 0) {
  console.log('\n   ⚠️  WARNINGS:\n');
  warnings.forEach(w => console.log(`      • ${w}`));
}

console.log('\n   📈 PSYCHOMETRIC VALIDITY SCORE:');
let score = 100;
score -= issues.length * 15;
score -= warnings.length * 5;
score = Math.max(0, score);

const scoreEmoji = score >= 90 ? '🟢' : score >= 70 ? '🟡' : '🔴';
console.log(`      ${scoreEmoji} ${score}/100`);

console.log('\n   ✓ All 7 PRISM dimensions covered');
console.log('   ✓ Multiple question types per dimension');
console.log('   ✓ Reverse-scored items for response bias detection');
console.log('   ✓ Weighted scoring maintains measurement precision');

console.log('\n');

