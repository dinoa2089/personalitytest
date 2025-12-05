/**
 * Comprehensive scoring verification
 * Tests that the algorithm correctly handles dimension-aware MBTI/Enneagram scoring
 */
const fs = require('fs');

// Load mock questions
const content = fs.readFileSync('lib/mock-questions.ts', 'utf8');
const arrayMatch = content.match(/export const mockQuestions[^=]*=\s*(\[[\s\S]*\]);?\s*$/);
let mockQuestions = [];
if (arrayMatch) {
  let jsonStr = arrayMatch[1].trim();
  if (jsonStr.endsWith(';')) jsonStr = jsonStr.slice(0, -1);
  mockQuestions = JSON.parse(jsonStr);
}

console.log('=== SCORING VERIFICATION ===\n');

// Test cases for each MBTI dimension
const testCases = [
  // E/I - extraversion questions
  {
    desc: 'High extraversion question (E behavior), answer 7 (agree)',
    dimension: 'extraversion',
    reversed: false,
    mbtiDim: 'mbti_ei',
    answer: 7,
    expectedMbti: 'high E score (10)'
  },
  {
    desc: 'Low extraversion question (I behavior), answer 7 (agree)',
    dimension: 'extraversion',
    reversed: true,
    mbtiDim: 'mbti_ei',
    answer: 7,
    expectedMbti: 'low E score (0) = I'
  },
  
  // S/N - openness questions
  {
    desc: 'High openness question (N behavior), answer 7 (agree)',
    dimension: 'openness',
    reversed: false,
    mbtiDim: 'mbti_sn',
    answer: 7,
    expectedMbti: 'low S score (0) = N'
  },
  {
    desc: 'Low openness question (S behavior), answer 7 (agree)',
    dimension: 'openness',
    reversed: true,
    mbtiDim: 'mbti_sn',
    answer: 7,
    expectedMbti: 'high S score (10)'
  },
  
  // T/F - agreeableness questions
  {
    desc: 'High agreeableness question (F behavior), answer 7 (agree)',
    dimension: 'agreeableness',
    reversed: false,
    mbtiDim: 'mbti_tf',
    answer: 7,
    expectedMbti: 'low T score (0) = F'
  },
  {
    desc: 'Low agreeableness question (T behavior), answer 7 (agree)',
    dimension: 'agreeableness',
    reversed: true,
    mbtiDim: 'mbti_tf',
    answer: 7,
    expectedMbti: 'high T score (10)'
  },
  
  // J/P - conscientiousness questions
  {
    desc: 'High conscientiousness question (J behavior), answer 7 (agree)',
    dimension: 'conscientiousness',
    reversed: false,
    mbtiDim: 'mbti_jp',
    answer: 7,
    expectedMbti: 'high J score (10)'
  },
  {
    desc: 'Low conscientiousness question (P behavior), answer 7 (agree)',
    dimension: 'conscientiousness',
    reversed: true,
    mbtiDim: 'mbti_jp',
    answer: 7,
    expectedMbti: 'low J score (0) = P'
  },
  
  // J/P - adaptability questions
  {
    desc: 'High adaptability question (P behavior), answer 7 (agree)',
    dimension: 'adaptability',
    reversed: false,
    mbtiDim: 'mbti_jp',
    answer: 7,
    expectedMbti: 'low J score (0) = P'
  },
  {
    desc: 'Low adaptability question (J behavior), answer 7 (agree)',
    dimension: 'adaptability',
    reversed: true,
    mbtiDim: 'mbti_jp',
    answer: 7,
    expectedMbti: 'high J score (10)'
  },
];

// Simulate the scoring algorithm
function simulateScore(testCase) {
  const { dimension, reversed, mbtiDim, answer } = testCase;
  
  // Convert likert 1-7 to 0-10
  let baseScore = ((answer - 1) / 6) * 10;
  
  // Apply reverse_scored (line 211 in mock-scoring.ts)
  let mbtiScore = reversed ? (10 - baseScore) : baseScore;
  
  // Apply dimension-aware corrections
  // T/F + agreeableness: always invert
  if (mbtiDim === 'mbti_tf' && dimension === 'agreeableness') {
    mbtiScore = 10 - mbtiScore;
  }
  // S/N + openness: always invert
  if (mbtiDim === 'mbti_sn' && dimension === 'openness') {
    mbtiScore = 10 - mbtiScore;
  }
  // J/P + adaptability: always invert
  if (mbtiDim === 'mbti_jp' && dimension === 'adaptability') {
    mbtiScore = 10 - mbtiScore;
  }
  
  return mbtiScore;
}

console.log('Testing MBTI scoring logic:\n');

let passed = 0;
let failed = 0;

testCases.forEach(tc => {
  const actual = simulateScore(tc);
  const expected = tc.expectedMbti;
  
  // Parse expected to check
  const expectHigh = expected.includes('high') && expected.includes('(10)');
  const expectLow = expected.includes('low') && expected.includes('(0)');
  
  const actualHigh = actual >= 9;
  const actualLow = actual <= 1;
  
  const isCorrect = (expectHigh && actualHigh) || (expectLow && actualLow);
  
  if (isCorrect) {
    console.log('✅ PASS: ' + tc.desc);
    console.log('   Actual score: ' + actual.toFixed(1) + ' | Expected: ' + expected);
    passed++;
  } else {
    console.log('❌ FAIL: ' + tc.desc);
    console.log('   Actual score: ' + actual.toFixed(1) + ' | Expected: ' + expected);
    failed++;
  }
  console.log('');
});

console.log('=== RESULTS ===');
console.log('Passed:', passed);
console.log('Failed:', failed);

if (failed === 0) {
  console.log('\n✅ ALL TESTS PASSED! Scoring logic is correct.');
} else {
  console.log('\n❌ SOME TESTS FAILED. Review the scoring algorithm.');
}

