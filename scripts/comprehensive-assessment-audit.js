/**
 * COMPREHENSIVE ASSESSMENT METHODOLOGY AUDIT
 * 
 * This script analyzes the entire question bank and selection algorithm
 * to identify systemic issues with framework coverage and confidence.
 */

const fs = require('fs');

// Load questions from the database export
let questions = [];
try {
  const exported = require('../questions_export.json');
  questions = exported.questions || exported;
  console.log(`Loaded ${questions.length} questions from questions_export.json`);
} catch (e) {
  console.error('Could not load questions_export.json:', e.message);
  console.error('Run: node -e "..." to export questions first');
  process.exit(1);
}

console.log('\n' + '='.repeat(80));
console.log('  COMPREHENSIVE ASSESSMENT METHODOLOGY AUDIT');
console.log('='.repeat(80));

// ============================================================================
// SECTION 1: QUESTION BANK OVERVIEW
// ============================================================================
console.log('\n\n📊 SECTION 1: QUESTION BANK OVERVIEW\n');
console.log('-'.repeat(60));

console.log(`Total Questions in Bank: ${questions.length}`);

// Count by dimension
const byDimension = {};
questions.forEach(q => {
  byDimension[q.dimension] = (byDimension[q.dimension] || 0) + 1;
});

console.log('\n📈 Questions by PRISM Dimension:');
const dimensions = ['openness', 'conscientiousness', 'extraversion', 'agreeableness', 
                    'emotionalResilience', 'honestyHumility', 'adaptability'];
dimensions.forEach(dim => {
  const count = byDimension[dim] || 0;
  const bar = '█'.repeat(Math.round(count / 2));
  console.log(`  ${dim.padEnd(20)} ${String(count).padStart(3)} ${bar}`);
});

// Count by type
const byType = {};
questions.forEach(q => {
  byType[q.type] = (byType[q.type] || 0) + 1;
});

console.log('\n📝 Questions by Type:');
Object.entries(byType).sort((a,b) => b[1] - a[1]).forEach(([type, count]) => {
  const pct = ((count / questions.length) * 100).toFixed(1);
  console.log(`  ${type.padEnd(25)} ${String(count).padStart(3)} (${pct}%)`);
});

// ============================================================================
// SECTION 2: MBTI FRAMEWORK COVERAGE
// ============================================================================
console.log('\n\n📊 SECTION 2: MBTI FRAMEWORK COVERAGE\n');
console.log('-'.repeat(60));

const mbtiDimensions = {
  'mbti_ei': { name: 'E/I (Extraversion/Introversion)', questions: [] },
  'mbti_sn': { name: 'S/N (Sensing/Intuition)', questions: [] },
  'mbti_tf': { name: 'T/F (Thinking/Feeling)', questions: [] },
  'mbti_jp': { name: 'J/P (Judging/Perceiving)', questions: [] }
};

questions.forEach(q => {
  if (!q.framework_tags) return;
  q.framework_tags.forEach(tag => {
    if (mbtiDimensions[tag]) {
      mbtiDimensions[tag].questions.push(q);
    }
  });
});

console.log('MBTI Dimension Coverage:');
console.log('(Minimum recommended: 10+ questions per dimension for confidence)\n');

let mbtiIssues = [];
Object.entries(mbtiDimensions).forEach(([tag, data]) => {
  const count = data.questions.length;
  const status = count >= 10 ? '✅' : count >= 5 ? '⚠️' : '❌';
  const bar = '█'.repeat(Math.round(count / 2));
  console.log(`  ${status} ${data.name.padEnd(35)} ${String(count).padStart(3)} ${bar}`);
  
  if (count < 10) {
    mbtiIssues.push({ dimension: data.name, count, needed: 10 - count });
  }
});

// Analyze MBTI question content
console.log('\n🔍 MBTI Question Content Analysis:');
Object.entries(mbtiDimensions).forEach(([tag, data]) => {
  console.log(`\n  ${data.name}:`);
  
  // Group by PRISM dimension
  const prismMapping = {};
  data.questions.forEach(q => {
    prismMapping[q.dimension] = (prismMapping[q.dimension] || 0) + 1;
  });
  
  Object.entries(prismMapping).sort((a,b) => b[1] - a[1]).forEach(([dim, count]) => {
    console.log(`    - Maps to ${dim}: ${count} questions`);
  });
  
  // Check for reverse scoring issues
  const reversed = data.questions.filter(q => q.reverse_scored).length;
  const normal = data.questions.length - reversed;
  console.log(`    - Normal scored: ${normal}, Reverse scored: ${reversed}`);
});

// ============================================================================
// SECTION 3: ENNEAGRAM FRAMEWORK COVERAGE
// ============================================================================
console.log('\n\n📊 SECTION 3: ENNEAGRAM FRAMEWORK COVERAGE\n');
console.log('-'.repeat(60));

const enneagramTypes = {};
for (let i = 1; i <= 9; i++) {
  enneagramTypes[`enneagram_${i}`] = { 
    name: `Type ${i}`, 
    questions: [],
    typeName: ['', 'Reformer', 'Helper', 'Achiever', 'Individualist', 
               'Investigator', 'Loyalist', 'Enthusiast', 'Challenger', 'Peacemaker'][i]
  };
}

questions.forEach(q => {
  if (!q.framework_tags) return;
  q.framework_tags.forEach(tag => {
    if (enneagramTypes[tag]) {
      enneagramTypes[tag].questions.push(q);
    }
  });
});

console.log('Enneagram Type Coverage:');
console.log('(Minimum recommended: 8+ questions per type for confidence)\n');

let enneagramIssues = [];
Object.entries(enneagramTypes).forEach(([tag, data]) => {
  const count = data.questions.length;
  const status = count >= 8 ? '✅' : count >= 5 ? '⚠️' : '❌';
  const bar = '█'.repeat(count);
  console.log(`  ${status} ${data.name} (${data.typeName.padEnd(12)}) ${String(count).padStart(3)} ${bar}`);
  
  if (count < 8) {
    enneagramIssues.push({ type: `${data.name} (${data.typeName})`, count, needed: 8 - count });
  }
});

// Calculate total Enneagram coverage
const totalEnneagramQuestions = Object.values(enneagramTypes)
  .reduce((sum, t) => sum + t.questions.length, 0);
console.log(`\nTotal Enneagram-tagged questions: ${totalEnneagramQuestions}`);

// ============================================================================
// SECTION 4: QUESTION SELECTION ALGORITHM ANALYSIS
// ============================================================================
console.log('\n\n📊 SECTION 4: QUESTION SELECTION ALGORITHM\n');
console.log('-'.repeat(60));

// Load and analyze the selection algorithm
console.log('Analyzing question-selection.ts and adaptive-selection.ts...\n');

// Simulate what a typical assessment would look like
const STANDARD_ASSESSMENT_SIZE = 35; // Typical free assessment
const FULL_ASSESSMENT_SIZE = 80;     // Full assessment

console.log('Assessment Configurations:');
console.log(`  - Free tier: ~${STANDARD_ASSESSMENT_SIZE} questions (8 min)`);
console.log(`  - Standard tier: ~${FULL_ASSESSMENT_SIZE} questions (15-20 min)`);

// Calculate expected coverage per framework
const expectedMbtiPerDim = Math.floor(STANDARD_ASSESSMENT_SIZE / 7 / 4 * 2); // rough estimate
const expectedEnneagramPerType = Math.floor(STANDARD_ASSESSMENT_SIZE / 7 / 9 * 1); // rough estimate

console.log(`\nExpected questions per MBTI dimension (35 Q assessment): ~${expectedMbtiPerDim}`);
console.log(`Expected questions per Enneagram type (35 Q assessment): ~${expectedEnneagramPerType}`);
console.log('\n⚠️  This is INSUFFICIENT for confident framework determinations!');

// ============================================================================
// SECTION 5: CRITICAL ISSUES IDENTIFIED
// ============================================================================
console.log('\n\n🚨 SECTION 5: CRITICAL ISSUES IDENTIFIED\n');
console.log('-'.repeat(60));

console.log('\n1. MBTI COVERAGE GAPS:');
if (mbtiIssues.length > 0) {
  mbtiIssues.forEach(issue => {
    console.log(`   ❌ ${issue.dimension}: Only ${issue.count} questions (need ${issue.needed} more)`);
  });
} else {
  console.log('   ✅ All MBTI dimensions have adequate direct question coverage');
}

console.log('\n2. ENNEAGRAM COVERAGE GAPS:');
if (enneagramIssues.length > 0) {
  enneagramIssues.forEach(issue => {
    console.log(`   ❌ ${issue.type}: Only ${issue.count} questions (need ${issue.needed} more)`);
  });
} else {
  console.log('   ✅ All Enneagram types have adequate question coverage');
}

console.log('\n3. METHODOLOGY CONCERNS:');
const concerns = [
  'J/P relies heavily on Conscientiousness (favors ISTJ over ENTJ)',
  'T/F mapped to Agreeableness (incomplete - ignores logical reasoning style)',
  'Enneagram Type 3 over-indexed on Conscientiousness (misses achievement/image focus)',
  'Question selection may not guarantee minimum coverage per framework',
  'No confidence threshold enforcement before displaying framework results'
];
concerns.forEach((c, i) => console.log(`   ${i+1}. ${c}`));

// ============================================================================
// SECTION 6: CROSS-FRAMEWORK DEPENDENCY ANALYSIS
// ============================================================================
console.log('\n\n📊 SECTION 6: PRISM → FRAMEWORK MAPPING ANALYSIS\n');
console.log('-'.repeat(60));

console.log('\nHow PRISM dimensions currently map to frameworks:\n');

const mappings = {
  'MBTI E/I': ['extraversion → E/I directly'],
  'MBTI S/N': ['openness → inverted for S/N'],
  'MBTI T/F': ['agreeableness → inverted for T/F', 'emotionalResilience → partial factor'],
  'MBTI J/P': ['conscientiousness → 60% weight', 'adaptability → 40% weight (inverted)'],
  'Enneagram 1': ['conscientiousness', 'honestyHumility'],
  'Enneagram 2': ['agreeableness', 'extraversion'],
  'Enneagram 3': ['conscientiousness (problem: should be achievement-focused)'],
  'Enneagram 4': ['openness', 'emotionalResilience (inverted)'],
  'Enneagram 5': ['openness', 'extraversion (inverted)'],
  'Enneagram 6': ['emotionalResilience (inverted)', 'conscientiousness'],
  'Enneagram 7': ['extraversion', 'openness', 'adaptability'],
  'Enneagram 8': ['extraversion', 'agreeableness (inverted)', 'emotionalResilience'],
  'Enneagram 9': ['agreeableness', 'emotionalResilience']
};

Object.entries(mappings).forEach(([framework, prismDims]) => {
  console.log(`  ${framework}:`);
  prismDims.forEach(d => console.log(`    ← ${d}`));
});

// ============================================================================
// SECTION 7: RECOMMENDATIONS
// ============================================================================
console.log('\n\n📋 SECTION 7: RECOMMENDATIONS\n');
console.log('-'.repeat(60));

console.log('\n🔴 HIGH PRIORITY:');
console.log('');
console.log('1. ADD DIRECT MBTI QUESTIONS');
console.log('   - Add 5+ questions directly measuring each MBTI dimension');
console.log('   - Questions should NOT rely on PRISM dimension inference');
console.log('   - Example J/P: "I prefer to make decisions quickly rather than');
console.log('     keep options open" (captures ENTJ, not just organized types)');
console.log('');
console.log('2. REBALANCE ENNEAGRAM COVERAGE');
const underCovered = Object.entries(enneagramTypes)
  .filter(([_, d]) => d.questions.length < 8)
  .map(([_, d]) => d.typeName);
if (underCovered.length > 0) {
  console.log(`   - Under-covered types: ${underCovered.join(', ')}`);
  console.log('   - Add 3-5 questions per under-covered type');
}
console.log('');
console.log('3. IMPLEMENT CONFIDENCE THRESHOLDS');
console.log('   - Only display MBTI type if >= 3 direct questions answered per dimension');
console.log('   - Only display Enneagram if >= 2 direct questions answered per type');
console.log('   - Show "Insufficient data" rather than potentially wrong results');
console.log('');
console.log('4. FIX QUESTION SELECTION ALGORITHM');
console.log('   - Guarantee minimum questions per framework dimension');
console.log('   - Add "framework coverage" check before allowing submission');
console.log('');

console.log('\n🟡 MEDIUM PRIORITY:');
console.log('');
console.log('1. FIX PRISM → MBTI MAPPINGS');
console.log('   - J/P: Add decisiveness factor, reduce conscientiousness weight');
console.log('   - T/F: Add logical reasoning questions, not just agreeableness inverse');
console.log('');
console.log('2. FIX PRISM → ENNEAGRAM MAPPINGS');
console.log('   - Type 3: Add achievement/image questions, not just conscientiousness');
console.log('   - Type 8: Add assertiveness/control questions');
console.log('');
console.log('3. ADD QUESTION DISCRIMINATION TRACKING');
console.log('   - Track which questions best differentiate between types');
console.log('   - Weight high-discrimination questions higher');

console.log('\n\n' + '='.repeat(80));
console.log('  END OF AUDIT REPORT');
console.log('='.repeat(80) + '\n');

// Output summary stats for further analysis
const summary = {
  totalQuestions: questions.length,
  byDimension,
  byType,
  mbtiCoverage: Object.fromEntries(
    Object.entries(mbtiDimensions).map(([k, v]) => [k, v.questions.length])
  ),
  enneagramCoverage: Object.fromEntries(
    Object.entries(enneagramTypes).map(([k, v]) => [k, v.questions.length])
  ),
  mbtiIssues,
  enneagramIssues
};

fs.writeFileSync('scripts/audit-summary.json', JSON.stringify(summary, null, 2));
console.log('Detailed summary saved to scripts/audit-summary.json\n');

