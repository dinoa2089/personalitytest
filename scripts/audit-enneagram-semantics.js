/**
 * Comprehensive Enneagram Semantic Audit
 * 
 * Each Enneagram type has a primary motivation/behavior pattern.
 * Questions describing that type's behavior should:
 * - Have reverse_scored=false if high agreement → high score for that type
 * 
 * Since Enneagram types are scored independently (not as poles),
 * the logic is simpler: does high agreement with this statement
 * indicate THIS type's characteristics?
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

console.log('=== ENNEAGRAM SEMANTIC AUDIT ===\n');

// Enneagram type characteristics (simplified)
const typeDescriptions = {
  'enneagram_1': ['perfectionist', 'principles', 'ethical', 'right', 'wrong', 'improve', 'critical', 'correct', 'standards', 'reform'],
  'enneagram_2': ['help', 'others\' needs', 'caring', 'generous', 'supportive', 'needed', 'appreciated', 'give', 'serve'],
  'enneagram_3': ['success', 'achieve', 'image', 'goals', 'accomplish', 'recognition', 'excel', 'winning', 'efficient', 'performance'],
  'enneagram_4': ['unique', 'authentic', 'deep emotions', 'different', 'creative', 'misunderstood', 'melancholy', 'special', 'express'],
  'enneagram_5': ['knowledge', 'observe', 'alone', 'privacy', 'understand', 'research', 'detach', 'analyze', 'expert', 'retreat'],
  'enneagram_6': ['security', 'loyal', 'trust', 'worst-case', 'prepared', 'authority', 'doubt', 'anxious', 'reliable', 'commitment'],
  'enneagram_7': ['adventure', 'options', 'fun', 'new experiences', 'spontaneous', 'optimistic', 'freedom', 'variety', 'excitement', 'possibilities'],
  'enneagram_8': ['control', 'power', 'strong', 'confront', 'protect', 'direct', 'assertive', 'challenge', 'dominant', 'decisive'],
  'enneagram_9': ['peace', 'harmony', 'avoid conflict', 'easygoing', 'accommodate', 'comfortable', 'calm', 'mediate', 'agree']
};

// Negative indicators that might invert the meaning
const negativeIndicators = ['struggle', 'avoid', 'difficult', 'rarely', 'don\'t', 'never', 'hate', 'dislike', 'uncomfortable'];

const allIssues = [];

for (const ennType of Object.keys(typeDescriptions)) {
  const questions = mockQuestions.filter(q => q.framework_tags?.includes(ennType));
  
  console.log('\n========================================');
  console.log('Type:', ennType);
  console.log('Total questions:', questions.length);
  console.log('========================================\n');
  
  const issues = [];
  
  for (const q of questions) {
    const text = q.text.toLowerCase();
    const reversed = q.reverse_scored || false;
    const typeKeywords = typeDescriptions[ennType];
    
    // Check if this question positively describes this type's behavior
    const matchesType = typeKeywords.some(k => text.includes(k));
    const hasNegative = negativeIndicators.some(n => text.includes(n));
    
    // For Enneagram, if the question positively describes the type:
    // - High agreement should → high score → reverse_scored=false
    // If the question negatively describes the type (e.g., "I struggle with X"):
    // - High agreement means LESS of that trait → reverse_scored=true
    
    let expectedReverse = null;
    let reason = '';
    
    if (matchesType && !hasNegative) {
      // Positive description of this type
      // High agreement = strong type indicator = reverse_scored should be false
      if (reversed === true) {
        expectedReverse = false;
        reason = 'Positive type description but reverse=true (high agreement should increase score)';
        issues.push({ text: q.text, id: q.id, currentReverse: reversed, expectedReverse, reason });
      }
    } else if (hasNegative && matchesType) {
      // Negative description (e.g., "I struggle to help others")
      // High agreement = LESS of this type = reverse_scored should be true
      if (reversed === false) {
        expectedReverse = true;
        reason = 'Negative framing but reverse=false (high agreement should decrease score)';
        issues.push({ text: q.text, id: q.id, currentReverse: reversed, expectedReverse, reason });
      }
    }
  }
  
  if (issues.length === 0) {
    console.log('✅ No clear semantic issues detected');
  } else {
    console.log('⚠️  Found ' + issues.length + ' potential issues:\n');
    issues.forEach(issue => {
      console.log('❌ "' + issue.text.substring(0, 60) + '..."');
      console.log('   Reason: ' + issue.reason);
      console.log('   Current: reverse_scored=' + issue.currentReverse);
      console.log('   Expected: reverse_scored=' + issue.expectedReverse);
      console.log('   ID: ' + issue.id);
      console.log('');
      allIssues.push({ ...issue, type: ennType });
    });
  }
}

console.log('\n========================================');
console.log('ENNEAGRAM ISSUES SUMMARY');
console.log('========================================\n');

if (allIssues.length === 0) {
  console.log('✅ No clear Enneagram semantic issues found');
} else {
  console.log('Total issues: ' + allIssues.length);
  console.log('\nIssues by type:');
  const byType = {};
  allIssues.forEach(i => {
    byType[i.type] = (byType[i.type] || 0) + 1;
  });
  Object.entries(byType).forEach(([type, count]) => {
    console.log('  ' + type + ': ' + count);
  });
  
  console.log('\nAll issues:');
  allIssues.forEach(issue => {
    console.log('- ' + issue.id + ' (' + issue.type + '): ' + issue.text.substring(0, 50) + '...');
  });
}

