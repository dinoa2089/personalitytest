/**
 * CORRECTED MBTI Semantic Audit
 * 
 * Understanding:
 * - Score > 50 = first letter (E, S, T, J)
 * - Score < 50 = second letter (I, N, F, P)
 * 
 * For a question describing FIRST letter behavior (E, S, T, J):
 *   - High agreement → high score → reverse_scored=false
 * 
 * For a question describing SECOND letter behavior (I, N, F, P):
 *   - High agreement → LOW score → reverse_scored=true
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

console.log('=== CORRECTED MBTI SEMANTIC AUDIT ===\n');

// Keywords that indicate behavior of each type
const typeIndicators = {
  // E/I
  extraverted: ['outgoing', 'social', 'energized by people', 'speak first', 'group', 'networking', 'talkative'],
  introverted: ['alone', 'solitary', 'quiet time', 'recharge', 'drained by', 'prefer working independently', 'blend into background', 'wait for others'],
  
  // S/N
  sensing: ['concrete', 'practical', 'facts', 'details', 'proven', 'established', 'step-by-step', 'literal'],
  intuitive: ['abstract', 'theoretical', 'deeper meaning', 'possibilities', 'brainstorm', 'new ideas', 'concepts', 'patterns', 'future'],
  
  // T/F
  thinking: ['logic', 'objective', 'analytical', 'critique', 'debate', 'truth', 'impersonal', 'fair', 'principles'],
  feeling: ['empathy', 'harmony', 'others\' needs', 'personal problems', 'feelings', 'caring', 'compassion', 'smooth things over', 'good intentions', 'help colleagues'],
  
  // J/P - we already fixed these
};

function analyzeQuestion(q, mbtiDim) {
  const text = q.text.toLowerCase();
  const reversed = q.reverse_scored || false;
  
  let describesFirst = false;  // E, S, T, or J
  let describesSecond = false; // I, N, F, or P
  
  if (mbtiDim === 'mbti_ei') {
    if (typeIndicators.extraverted.some(k => text.includes(k))) describesFirst = true;
    if (typeIndicators.introverted.some(k => text.includes(k))) describesSecond = true;
  } else if (mbtiDim === 'mbti_sn') {
    if (typeIndicators.sensing.some(k => text.includes(k))) describesFirst = true;
    if (typeIndicators.intuitive.some(k => text.includes(k))) describesSecond = true;
  } else if (mbtiDim === 'mbti_tf') {
    if (typeIndicators.thinking.some(k => text.includes(k))) describesFirst = true;
    if (typeIndicators.feeling.some(k => text.includes(k))) describesSecond = true;
  }
  
  // Determine expected reverse_scored
  let expected = null;
  if (describesFirst && !describesSecond) {
    expected = false;  // First letter behavior, high agreement = high score
  } else if (describesSecond && !describesFirst) {
    expected = true;   // Second letter behavior, high agreement = low score
  }
  
  // Check for mismatch
  if (expected !== null && expected !== reversed) {
    return {
      text: q.text,
      id: q.id,
      dimension: q.dimension,
      currentReverse: reversed,
      expectedReverse: expected,
      reason: describesFirst ? 'Describes first letter (E/S/T/J) but has reverse=true' : 'Describes second letter (I/N/F/P) but has reverse=false'
    };
  }
  
  return null;
}

const realIssues = [];

for (const mbtiDim of ['mbti_ei', 'mbti_sn', 'mbti_tf']) {
  const questions = mockQuestions.filter(q => q.framework_tags?.includes(mbtiDim));
  
  console.log('\n========================================');
  console.log('Dimension:', mbtiDim);
  console.log('Total questions:', questions.length);
  console.log('========================================\n');
  
  const issues = [];
  for (const q of questions) {
    const issue = analyzeQuestion(q, mbtiDim);
    if (issue) {
      issues.push(issue);
    }
  }
  
  if (issues.length === 0) {
    console.log('✅ No clear semantic issues detected');
  } else {
    console.log('⚠️  Found ' + issues.length + ' semantic issues:\n');
    issues.forEach(issue => {
      console.log('❌ "' + issue.text.substring(0, 60) + '..."');
      console.log('   Reason: ' + issue.reason);
      console.log('   Current: reverse_scored=' + issue.currentReverse);
      console.log('   Expected: reverse_scored=' + issue.expectedReverse);
      console.log('   ID: ' + issue.id);
      console.log('');
      realIssues.push(issue);
    });
  }
}

console.log('\n========================================');
console.log('REAL ISSUES REQUIRING FIXES');
console.log('========================================\n');

if (realIssues.length === 0) {
  console.log('✅ No clear semantic issues found in E/I, S/N, T/F');
} else {
  console.log('Total issues: ' + realIssues.length);
  realIssues.forEach(issue => {
    console.log('- ' + issue.id + ': ' + issue.text.substring(0, 50) + '...');
  });
}

