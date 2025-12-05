/**
 * Audit J/P questions for semantic correctness of reverse_scored flag
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

// Filter J/P questions
const jpQuestions = mockQuestions.filter(q => 
  q.framework_tags?.includes('mbti_jp')
);

console.log('=== J/P QUESTIONS SEMANTIC AUDIT ===\n');
console.log('Total J/P questions:', jpQuestions.length);
console.log('\n');

// Categorize by PRISM dimension
const adaptQuestions = jpQuestions.filter(q => q.dimension === 'adaptability');
const conscQuestions = jpQuestions.filter(q => q.dimension === 'conscientiousness');

console.log('--- ADAPTABILITY dimension questions ---');
console.log('(High adaptability = flexible = P trait)');
console.log('(If reverse_scored=false, high answer → J which is WRONG for adaptability)');
console.log('');

adaptQuestions.forEach(q => {
  const flag = q.reverse_scored ? '✅' : '❌ WRONG';
  const desc = q.reverse_scored 
    ? 'High → P (correct)' 
    : 'High → J (WRONG for adaptability!)';
  console.log(flag + ' "' + q.text.substring(0, 60) + '..."');
  console.log('   reverse_scored: ' + q.reverse_scored + ' → ' + desc);
  console.log('');
});

console.log('\n--- CONSCIENTIOUSNESS dimension questions ---');
console.log('(High conscientiousness = structured = J trait)');
console.log('(If reverse_scored=false, high answer → J which is CORRECT)');
console.log('');

conscQuestions.forEach(q => {
  // For conscientiousness: 
  // - High conscientiousness = J (structured, planned)
  // - So reverse_scored=false is typically correct (high → J)
  // - BUT if the question text is NEGATIVE (e.g., "I struggle with..."), then it's reversed
  
  // Check if question has negative framing
  const negativeIndicators = ['struggle', 'difficult', 'hard time', 'avoid', 'rarely', 'seldom', 'fail', 'neglect', 'trouble', 'don\'t'];
  const isNegativelyFramed = negativeIndicators.some(ind => q.text.toLowerCase().includes(ind));
  
  let flag, desc;
  if (isNegativelyFramed) {
    // Negative framing: "I struggle to plan" - high agreement = LOW planning = P
    // So should be reverse_scored=true
    flag = q.reverse_scored ? '✅' : '❌ WRONG';
    desc = q.reverse_scored 
      ? 'Negative framing + reverse=true → correct' 
      : 'Negative framing but reverse=false → HIGH agreement → J (WRONG!)';
  } else {
    // Positive framing: "I make detailed plans" - high agreement = HIGH planning = J
    // So should be reverse_scored=false
    flag = !q.reverse_scored ? '✅' : '⚠️ CHECK';
    desc = !q.reverse_scored 
      ? 'Positive framing + reverse=false → correct' 
      : 'Positive framing but reverse=true → HIGH agreement → P (check this)';
  }
  
  console.log(flag + ' "' + q.text.substring(0, 60) + '..."');
  console.log('   reverse_scored: ' + q.reverse_scored + ' → ' + desc);
  console.log('');
});

console.log('\n=== SUMMARY ===');

// Count potentially wrong adaptability questions
const wrongAdapt = adaptQuestions.filter(q => !q.reverse_scored);
console.log('Adaptability questions with reverse_scored=false (likely WRONG):', wrongAdapt.length);
wrongAdapt.forEach(q => console.log('  - ' + q.text.substring(0, 50) + '...'));

