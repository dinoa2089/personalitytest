/**
 * Validate Question Bank Integrity
 * 
 * Ensures the question bank maintains psychometric validity after updates:
 * - All 7 PRISM dimensions adequately covered
 * - Question type distribution is balanced
 * - Reverse-scored items properly distributed
 * - No orphaned or incomplete questions
 * - Framework tags preserved
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Expected minimums for validity
const VALIDITY_REQUIREMENTS = {
  minQuestionsPerDimension: 15,
  minReversePerDimension: 2,
  minQuestionTypes: 3, // Need at least 3 different types
  questionTypeMinimums: {
    likert: 80,
    behavioral_frequency: 20,
    situational_judgment: 15,
    forced_choice: 10,
  },
  dimensions: [
    'openness',
    'conscientiousness', 
    'extraversion',
    'agreeableness',
    'emotionalResilience',
    'honestyHumility',
    'adaptability'
  ]
};

async function validateQuestions() {
  console.log('🔍 Validating Question Bank Integrity\n');
  console.log('='.repeat(100));
  
  // Fetch all questions
  const { data: questions, error } = await supabase
    .from('questions')
    .select('*');
  
  if (error) {
    console.error('❌ Error fetching questions:', error);
    return;
  }
  
  console.log(`\n📊 Total questions in database: ${questions.length}\n`);
  
  const issues = [];
  const warnings = [];
  
  // ============================================================================
  // 1. DIMENSION COVERAGE
  // ============================================================================
  
  console.log('━'.repeat(100));
  console.log('📋 DIMENSION COVERAGE\n');
  
  const dimensionStats = {};
  for (const dim of VALIDITY_REQUIREMENTS.dimensions) {
    const dimQuestions = questions.filter(q => q.dimension === dim);
    const reverseCount = dimQuestions.filter(q => q.reverse_scored).length;
    
    dimensionStats[dim] = {
      total: dimQuestions.length,
      reverse: reverseCount,
      types: [...new Set(dimQuestions.map(q => q.type))]
    };
    
    const status = dimQuestions.length >= VALIDITY_REQUIREMENTS.minQuestionsPerDimension ? '✅' : '❌';
    const reverseStatus = reverseCount >= VALIDITY_REQUIREMENTS.minReversePerDimension ? '✅' : '⚠️';
    
    console.log(`   ${dim.padEnd(22)} ${String(dimQuestions.length).padStart(3)} questions ${status}  |  ${reverseCount} reverse-scored ${reverseStatus}`);
    
    if (dimQuestions.length < VALIDITY_REQUIREMENTS.minQuestionsPerDimension) {
      issues.push(`${dim}: Only ${dimQuestions.length} questions (need ${VALIDITY_REQUIREMENTS.minQuestionsPerDimension}+)`);
    }
    if (reverseCount < VALIDITY_REQUIREMENTS.minReversePerDimension) {
      warnings.push(`${dim}: Only ${reverseCount} reverse-scored items (recommend ${VALIDITY_REQUIREMENTS.minReversePerDimension}+)`);
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
  
  for (const [type, count] of Object.entries(typeStats).sort((a, b) => b[1] - a[1])) {
    const min = VALIDITY_REQUIREMENTS.questionTypeMinimums[type] || 0;
    const status = count >= min ? '✅' : '⚠️';
    const bar = '█'.repeat(Math.min(50, Math.round(count / 3)));
    console.log(`   ${type.padEnd(22)} ${String(count).padStart(3)} ${status} ${bar}`);
    
    if (count < min) {
      warnings.push(`${type}: Only ${count} questions (recommend ${min}+)`);
    }
  }
  
  // ============================================================================
  // 3. IRT PARAMETER COVERAGE
  // ============================================================================
  
  console.log('\n' + '━'.repeat(100));
  console.log('📋 IRT DISCRIMINATION PARAMETERS\n');
  
  const withDiscrimination = questions.filter(q => q.discrimination && q.discrimination !== 1.0);
  const avgDiscrimination = questions.reduce((sum, q) => sum + (q.discrimination || 1.0), 0) / questions.length;
  
  console.log(`   Questions with custom discrimination: ${withDiscrimination.length}`);
  console.log(`   Average discrimination value: ${avgDiscrimination.toFixed(2)}`);
  
  if (withDiscrimination.length < 20) {
    warnings.push('Few questions have calibrated IRT discrimination parameters');
  }
  
  // ============================================================================
  // 4. FRAMEWORK TAG COVERAGE (MBTI, Enneagram)
  // ============================================================================
  
  console.log('\n' + '━'.repeat(100));
  console.log('📋 FRAMEWORK TAG COVERAGE\n');
  
  const withFrameworkTags = questions.filter(q => q.framework_tags && q.framework_tags.length > 0);
  const mbtiTagged = questions.filter(q => q.framework_tags?.some(t => t.startsWith('mbti_')));
  const enneagramTagged = questions.filter(q => q.framework_tags?.some(t => t.startsWith('enneagram_')));
  
  console.log(`   Questions with framework tags: ${withFrameworkTags.length}`);
  console.log(`   MBTI-tagged questions: ${mbtiTagged.length}`);
  console.log(`   Enneagram-tagged questions: ${enneagramTagged.length}`);
  
  // ============================================================================
  // 5. QUESTION TEXT QUALITY CHECKS
  // ============================================================================
  
  console.log('\n' + '━'.repeat(100));
  console.log('📋 QUESTION TEXT QUALITY\n');
  
  const shortQuestions = questions.filter(q => q.text.length < 30);
  const longQuestions = questions.filter(q => q.text.length > 200);
  const emptyOptions = questions.filter(q => q.type !== 'likert' && q.type !== 'behavioral_frequency' && (!q.options || q.options.length === 0));
  
  console.log(`   Very short questions (<30 chars): ${shortQuestions.length} ${shortQuestions.length > 0 ? '⚠️' : '✅'}`);
  console.log(`   Very long questions (>200 chars): ${longQuestions.length} ${longQuestions.length > 20 ? '⚠️' : '✅'}`);
  console.log(`   Questions missing options: ${emptyOptions.length} ${emptyOptions.length > 0 ? '❌' : '✅'}`);
  
  if (shortQuestions.length > 0) {
    warnings.push(`${shortQuestions.length} questions are very short (may lack context)`);
  }
  if (emptyOptions.length > 0) {
    issues.push(`${emptyOptions.length} non-Likert questions are missing options`);
  }
  
  // ============================================================================
  // 6. SCORING COVERAGE CHECK
  // ============================================================================
  
  console.log('\n' + '━'.repeat(100));
  console.log('📋 SCORING METHODOLOGY COVERAGE\n');
  
  // Check that we have enough questions to reliably score each dimension
  const scoringCoverage = {};
  for (const dim of VALIDITY_REQUIREMENTS.dimensions) {
    const dimQuestions = questions.filter(q => q.dimension === dim);
    const likertCount = dimQuestions.filter(q => q.type === 'likert').length;
    const behavioralCount = dimQuestions.filter(q => q.type === 'behavioral_frequency').length;
    const situationalCount = dimQuestions.filter(q => q.type === 'situational_judgment').length;
    
    // Weighted question count (behavioral 1.5x, situational 1.3x, likert 1.0x)
    const effectiveCount = likertCount + (behavioralCount * 1.5) + (situationalCount * 1.3);
    
    scoringCoverage[dim] = {
      raw: dimQuestions.length,
      effective: effectiveCount.toFixed(1),
      adequate: effectiveCount >= 15
    };
    
    const status = scoringCoverage[dim].adequate ? '✅' : '⚠️';
    console.log(`   ${dim.padEnd(22)} Raw: ${String(dimQuestions.length).padStart(2)} | Weighted: ${effectiveCount.toFixed(1).padStart(5)} ${status}`);
  }
  
  // ============================================================================
  // SUMMARY
  // ============================================================================
  
  console.log('\n' + '='.repeat(100));
  console.log('\n📊 VALIDATION SUMMARY\n');
  
  if (issues.length === 0 && warnings.length === 0) {
    console.log('   ✅ ALL CHECKS PASSED - Question bank maintains psychometric integrity\n');
  } else {
    if (issues.length > 0) {
      console.log('   ❌ CRITICAL ISSUES (must fix):\n');
      issues.forEach(i => console.log(`      • ${i}`));
    }
    if (warnings.length > 0) {
      console.log('\n   ⚠️  WARNINGS (recommended improvements):\n');
      warnings.forEach(w => console.log(`      • ${w}`));
    }
  }
  
  console.log('\n   📈 PSYCHOMETRIC VALIDITY INDICATORS:');
  console.log(`      • Dimension coverage: ${Object.values(dimensionStats).every(d => d.total >= 15) ? '✅ Adequate' : '⚠️ Some gaps'}`);
  console.log(`      • Reverse-scoring balance: ${Object.values(dimensionStats).every(d => d.reverse >= 2) ? '✅ Balanced' : '⚠️ Some dimensions lack reverse items'}`);
  console.log(`      • Question type diversity: ${Object.keys(typeStats).length >= 3 ? '✅ Diverse' : '⚠️ Limited variety'}`);
  console.log(`      • IRT calibration: ${withDiscrimination.length >= 20 ? '✅ Calibrated' : '⚠️ Needs more calibration'}`);
  console.log(`      • Framework mapping: ${mbtiTagged.length >= 30 && enneagramTagged.length >= 20 ? '✅ Good coverage' : '⚠️ Could improve'}`);
  
  console.log('\n');
  
  return { issues, warnings, dimensionStats, typeStats };
}

async function main() {
  await validateQuestions();
}

main().catch(console.error);


