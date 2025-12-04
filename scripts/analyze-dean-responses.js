/**
 * Analyze Dean's assessment responses
 */

const responses = [
  // Conscientiousness responses
  {"value":5,"dimension":"conscientiousness","type":"likert"},
  {"value":5,"dimension":"conscientiousness","type":"likert"},
  {"value":3,"dimension":"conscientiousness","type":"likert"},
  {"value":2,"dimension":"conscientiousness","type":"likert"},
  {"value":2,"dimension":"conscientiousness","type":"likert"},
  {"value":6,"dimension":"conscientiousness","type":"likert"},
  {"value":5,"dimension":"conscientiousness","type":"likert"},
  {"value":2,"dimension":"conscientiousness","type":"behavioral_frequency"},
  {"value":2,"dimension":"conscientiousness","type":"behavioral_frequency"},
  {"value":2,"dimension":"conscientiousness","type":"behavioral_frequency"},
  {"value":4,"dimension":"conscientiousness","type":"behavioral_frequency"},
  {"value":"Submit the work immediately and take the opportunity to relax...","dimension":"conscientiousness","type":"situational_judgment"},
  
  // Adaptability responses
  {"value":2,"dimension":"adaptability","type":"likert"},
  {"value":2,"dimension":"adaptability","type":"likert"},
  {"value":5,"dimension":"adaptability","type":"likert"},
  {"value":2,"dimension":"adaptability","type":"likert"},
  {"value":6,"dimension":"adaptability","type":"likert"},
  {"value":4,"dimension":"adaptability","type":"behavioral_frequency"},
  {"value":5,"dimension":"adaptability","type":"likert"},
  {"value":6,"dimension":"adaptability","type":"likert"},
  {"value":2,"dimension":"adaptability","type":"likert"},
  
  // Extraversion responses
  {"value":3,"dimension":"extraversion","type":"likert"},
  {"value":2,"dimension":"extraversion","type":"likert"},
  {"value":6,"dimension":"extraversion","type":"likert"},
  {"value":4,"dimension":"extraversion","type":"likert"},
  {"value":2,"dimension":"extraversion","type":"likert"},
  {"value":4,"dimension":"extraversion","type":"behavioral_frequency"},
  {"value":6,"dimension":"extraversion","type":"likert"},
  {"value":5,"dimension":"extraversion","type":"likert"},
  {"value":7,"dimension":"extraversion","type":"likert"},
  {"value":3,"dimension":"extraversion","type":"likert"},
  {"value":6,"dimension":"extraversion","type":"likert"},
  {"value":5,"dimension":"extraversion","type":"likert"},
  {"value":6,"dimension":"extraversion","type":"likert"},
  {"value":6,"dimension":"extraversion","type":"likert"},
  {"value":6,"dimension":"extraversion","type":"likert"},
];

// Group by dimension
const byDimension = {};
responses.forEach(r => {
  if (typeof r.value !== 'number') return; // Skip situational judgment for now
  if (!byDimension[r.dimension]) byDimension[r.dimension] = [];
  byDimension[r.dimension].push(r.value);
});

console.log('\n=== DEAN\'S RESPONSE ANALYSIS ===\n');

for (const [dim, values] of Object.entries(byDimension)) {
  const avg = values.reduce((a,b) => a+b, 0) / values.length;
  const min = Math.min(...values);
  const max = Math.max(...values);
  
  // Convert to percentile-like scale (1-7 → roughly 0-100)
  const normalized = ((avg - 1) / 6) * 100;
  
  console.log(`${dim.toUpperCase()}`);
  console.log(`  Responses: ${values.join(', ')}`);
  console.log(`  Average: ${avg.toFixed(2)} / 7`);
  console.log(`  Range: ${min} - ${max}`);
  console.log(`  Normalized: ~${normalized.toFixed(0)}th percentile`);
  console.log('');
}

console.log('\n=== KEY FINDINGS ===\n');

// Conscientiousness analysis
const cScores = byDimension['conscientiousness'] || [];
const cAvg = cScores.reduce((a,b) => a+b, 0) / cScores.length;
console.log('CONSCIENTIOUSNESS (affects J/P and Type 3):');
console.log(`  Your average: ${cAvg.toFixed(2)} / 7`);
console.log(`  Low responses (≤3): ${cScores.filter(v => v <= 3).length} questions`);
console.log(`  High responses (≥5): ${cScores.filter(v => v >= 5).length} questions`);
console.log('');

// Adaptability analysis
const aScores = byDimension['adaptability'] || [];
const aAvg = aScores.reduce((a,b) => a+b, 0) / aScores.length;
console.log('ADAPTABILITY (affects J/P - high = P):');
console.log(`  Your average: ${aAvg.toFixed(2)} / 7`);
console.log(`  Low responses (≤3): ${aScores.filter(v => v <= 3).length} questions`);
console.log(`  High responses (≥5): ${aScores.filter(v => v >= 5).length} questions`);
console.log('');

// J/P Calculation
const cPercentile = ((cAvg - 1) / 6) * 100;
const aPercentile = ((aAvg - 1) / 6) * 100;
const jpScore = cPercentile * 0.6 + (100 - aPercentile) * 0.4;
console.log('J/P SCORE CALCULATION:');
console.log(`  Conscientiousness percentile: ${cPercentile.toFixed(1)}`);
console.log(`  Adaptability percentile: ${aPercentile.toFixed(1)}`);
console.log(`  J/P = ${cPercentile.toFixed(1)} × 0.6 + (100 - ${aPercentile.toFixed(1)}) × 0.4`);
console.log(`  J/P = ${(cPercentile * 0.6).toFixed(1)} + ${((100 - aPercentile) * 0.4).toFixed(1)}`);
console.log(`  J/P = ${jpScore.toFixed(1)}`);
console.log(`  Result: ${jpScore >= 50 ? 'JUDGING' : 'PERCEIVING'}`);

