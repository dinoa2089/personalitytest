/**
 * Test that J/P selection is balanced across styles
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

// Simulate the selection algorithm's J/P selection
function simulateJPSelection(needed) {
  const selected = [];
  const usedIds = new Set();
  
  const getAvailable = (filter) => {
    return mockQuestions.filter(q => {
      if (usedIds.has(q.id)) return false;
      if (!q.framework_tags?.includes('mbti_jp')) return false;
      return filter(q);
    });
  };
  
  const selectRandomN = (arr, n) => {
    if (n >= arr.length) return [...arr];
    const shuffled = [...arr].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, n);
  };
  
  const addQuestion = (q) => {
    if (usedIds.has(q.id)) return;
    selected.push(q);
    usedIds.add(q.id);
  };
  
  const halfNeeded = Math.ceil(needed / 2);
  
  // Conscientiousness-based (ISTJ-style)
  const conscQuestions = getAvailable(q => q.dimension === 'conscientiousness');
  selectRandomN(conscQuestions, halfNeeded).forEach(addQuestion);
  
  // Adaptability-based (P-style / inverted = J-style)
  const adaptQuestions = getAvailable(q => q.dimension === 'adaptability');
  selectRandomN(adaptQuestions, halfNeeded).forEach(addQuestion);
  
  // Extraversion-based (command/leadership)
  const extraversionJP = getAvailable(q => q.dimension === 'extraversion');
  if (extraversionJP.length > 0) {
    selectRandomN(extraversionJP, 1).forEach(addQuestion);
  }
  
  // Fill remaining
  if (selected.length < needed) {
    const remaining = getAvailable(() => true);
    selectRandomN(remaining, needed - selected.length).forEach(addQuestion);
  }
  
  return selected;
}

console.log('=== J/P SELECTION BALANCE TEST ===\n');
console.log('Running 10 simulations of selecting 6 J/P questions...\n');

const styleCounts = {
  conscientiousness: 0,
  adaptability: 0,
  extraversion: 0,
  other: 0
};

for (let i = 0; i < 10; i++) {
  const selected = simulateJPSelection(6);
  
  console.log('Simulation', i + 1 + ':');
  selected.forEach(q => {
    const style = q.dimension;
    styleCounts[style] = (styleCounts[style] || 0) + 1;
    console.log('  [' + q.dimension + '] ' + q.text.substring(0, 50) + '...');
  });
  console.log('');
}

console.log('=== AGGREGATE STYLE DISTRIBUTION ===');
console.log('Across 10 simulations (60 total selections):');
for (const [style, count] of Object.entries(styleCounts)) {
  const pct = ((count / 60) * 100).toFixed(1);
  console.log('  ' + style + ': ' + count + ' (' + pct + '%)');
}

const idealBalance = 60 / 3; // ~20 each for 3 main categories
const conscientiousnessPct = styleCounts.conscientiousness / 60;
const adaptabilityPct = styleCounts.adaptability / 60;

console.log('\n=== BALANCE CHECK ===');
if (conscientiousnessPct > 0.25 && conscientiousnessPct < 0.55 &&
    adaptabilityPct > 0.25 && adaptabilityPct < 0.55) {
  console.log('✅ Good balance between ISTJ-style and other J/P styles');
} else {
  console.log('⚠️  Imbalanced - check selection algorithm');
}

