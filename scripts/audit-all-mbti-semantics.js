/**
 * Audit ALL MBTI dimensions for semantic correctness of reverse_scored flags
 */
const fs = require('fs');

const content = fs.readFileSync('lib/mock-questions.ts', 'utf8');
const arrayMatch = content.match(/export const mockQuestions[^=]*=\s*(\[[\s\S]*\]);?\s*$/);
let mockQuestions = [];
if (arrayMatch) {
  let jsonStr = arrayMatch[1].trim();
  if (jsonStr.endsWith(';')) jsonStr = jsonStr.slice(0, -1);
  mockQuestions = JSON.parse(jsonStr);
}

console.log('=== FULL MBTI SEMANTIC AUDIT ===\n');
console.log('Total questions:', mockQuestions.length);

// Define expected dimension → MBTI trait mappings
// For each PRISM dimension, high score should map to which MBTI pole?
const dimensionExpectations = {
  // E/I: High extraversion = E
  'mbti_ei': {
    'extraversion': { highMeansFirst: true },  // high extraversion → E, so reverse_scored=false is correct
  },
  // S/N: High openness = N (opposite pole)
  'mbti_sn': {
    'openness': { highMeansFirst: false },  // high openness → N (not S), so reverse_scored should be true for S
  },
  // T/F: Low agreeableness = T
  'mbti_tf': {
    'agreeableness': { highMeansFirst: false },  // high agreeableness → F, so for T, reverse_scored should be true
    'emotionalResilience': { highMeansFirst: true },  // high resilience → T
  },
  // J/P: High conscientiousness = J, High adaptability = P
  'mbti_jp': {
    'conscientiousness': { highMeansFirst: true },  // high conscientiousness → J, reverse_scored=false is correct
    'adaptability': { highMeansFirst: false },  // high adaptability → P, so for J questions, reverse_scored should be true
  }
};

function auditDimension(mbtiDim) {
  const questions = mockQuestions.filter(q => q.framework_tags?.includes(mbtiDim));
  console.log('\n========================================');
  console.log('Dimension:', mbtiDim);
  console.log('Total questions:', questions.length);
  console.log('========================================\n');
  
  const issues = [];
  
  for (const q of questions) {
    const prismDim = q.dimension?.toLowerCase();
    const expectations = dimensionExpectations[mbtiDim];
    
    if (!expectations || !expectations[prismDim]) {
      // Unknown mapping
      continue;
    }
    
    const { highMeansFirst } = expectations[prismDim];
    
    // If highMeansFirst is true, then reverse_scored should be false for normal questions
    // If highMeansFirst is false, then reverse_scored should be true for normal questions
    
    // But we also need to check for negative framing in the question text
    const negativeIndicators = ['struggle', 'difficult', 'hard time', 'avoid', 'rarely', 'seldom', 
                                'fail', 'neglect', 'trouble', 'don\'t', 'uncomfortable', 'uneasy',
                                'stressed', 'stressful', 'prefer not'];
    const positiveFlexIndicators = ['easily', 'quickly', 'immediately', 'enjoy', 'prefer'];
    
    const isNegativeFraming = negativeIndicators.some(ind => q.text.toLowerCase().includes(ind));
    
    // For adaptability dimension with mbti_jp:
    // "I easily adjust plans" = high adaptability = P, so high agreement should → P (reverse_scored=true for J scale)
    // "I struggle to adapt" = high agreement = low adaptability = J (reverse_scored=false for J scale)
    
    // Check if this is a flexibility question
    const isFlexibilityPositive = positiveFlexIndicators.some(ind => q.text.toLowerCase().includes(ind));
    
    let expectedReverse;
    if (prismDim === 'adaptability' && mbtiDim === 'mbti_jp') {
      // Special case: adaptability questions for J/P
      if (isFlexibilityPositive) {
        // "I easily adjust" - high agreement = P, so reverse_scored should be TRUE for J scale
        expectedReverse = true;
      } else if (isNegativeFraming) {
        // "I struggle when routine changes" - high agreement = not flexible = J, so reverse_scored should be FALSE
        expectedReverse = false;
      } else {
        // Default: high adaptability = P, so reverse_scored should be TRUE
        expectedReverse = true;
      }
    } else if (isNegativeFraming) {
      // Negative framing inverts the expected value
      expectedReverse = highMeansFirst;
    } else {
      // Normal framing
      expectedReverse = !highMeansFirst;
    }
    
    const actualReverse = q.reverse_scored || false;
    
    if (actualReverse !== expectedReverse) {
      issues.push({
        text: q.text,
        dimension: q.dimension,
        currentReverse: actualReverse,
        expectedReverse: expectedReverse,
        id: q.id
      });
    }
  }
  
  if (issues.length === 0) {
    console.log('✅ All questions appear semantically correct');
  } else {
    console.log('⚠️  Found ' + issues.length + ' potential issues:\n');
    issues.forEach(issue => {
      console.log('❌ "' + issue.text.substring(0, 60) + '..."');
      console.log('   PRISM: ' + issue.dimension);
      console.log('   Current: reverse_scored=' + issue.currentReverse);
      console.log('   Expected: reverse_scored=' + issue.expectedReverse);
      console.log('   ID: ' + issue.id);
      console.log('');
    });
  }
  
  return issues;
}

const allIssues = {};
for (const dim of ['mbti_ei', 'mbti_sn', 'mbti_tf', 'mbti_jp']) {
  allIssues[dim] = auditDimension(dim);
}

console.log('\n========================================');
console.log('SUMMARY');
console.log('========================================');
let totalIssues = 0;
for (const [dim, issues] of Object.entries(allIssues)) {
  console.log(dim + ': ' + issues.length + ' issues');
  totalIssues += issues.length;
}
console.log('\nTotal potential issues: ' + totalIssues);

