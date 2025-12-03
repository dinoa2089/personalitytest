/**
 * Analyze Exported Questions for Duplicates
 * Works offline using questions_export.json
 */

const fs = require('fs');
const path = require('path');

// Load questions from export file
const questionsFile = path.join(__dirname, '..', 'questions_export.json');
let allQuestions = [];

try {
  // Remove BOM if present
  let fileContent = fs.readFileSync(questionsFile, 'utf8');
  if (fileContent.charCodeAt(0) === 0xFEFF) {
    fileContent = fileContent.slice(1);
  }
  const data = JSON.parse(fileContent);
  // Handle nested structure
  if (data.questions) {
    allQuestions = data.questions;
  } else if (Array.isArray(data)) {
    allQuestions = data;
  } else {
    // Might be grouped by dimension
    for (const key of Object.keys(data)) {
      if (Array.isArray(data[key])) {
        allQuestions.push(...data[key]);
      }
    }
  }
} catch (e) {
  console.error('Error loading questions:', e.message);
  process.exit(1);
}

console.log(`📊 Loaded ${allQuestions.length} questions\n`);

// Keywords for concept clusters
const CONCEPT_KEYWORDS = {
  'PLANNING/SCHEDULING': ['plan', 'schedule', 'organize', 'prepare', 'checklist', 'itinerary', 'ahead', 'advance', 'routine'],
  'SOCIAL/PARTIES': ['party', 'crowd', 'social', 'gathering', 'alone', 'solitude', 'quiet', 'introvert', 'extrovert'],
  'STRESS/PRESSURE': ['stress', 'pressure', 'overwhelm', 'calm', 'anxious', 'worry', 'tense', 'relax'],
  'RISK/ADVENTURE': ['risk', 'danger', 'safe', 'cautious', 'adventure', 'thrill', 'uncertain', 'gamble'],
  'CREATIVITY/IDEAS': ['creative', 'imagination', 'idea', 'innovative', 'artistic', 'original', 'invent', 'novel'],
  'HELPING/SUPPORT': ['help', 'support', 'care', 'assist', 'volunteer', 'others', 'need', 'compassion'],
  'HONESTY/TRUTH': ['honest', 'truth', 'lie', 'deceive', 'authentic', 'genuine', 'sincere', 'integrity'],
  'DEADLINES/TIME': ['deadline', 'time', 'punctual', 'late', 'early', 'on time', 'procrastin'],
  'CONFLICT/HARMONY': ['conflict', 'argument', 'disagree', 'confront', 'avoid', 'harmony', 'peace', 'fight'],
  'CHANGE/ADAPT': ['change', 'adapt', 'flexible', 'routine', 'unexpected', 'pivot', 'adjust'],
  'FEEDBACK/CRITICISM': ['feedback', 'criticism', 'critique', 'review', 'judgment', 'opinion', 'evaluate'],
  'GOALS/ACHIEVEMENT': ['goal', 'ambition', 'achieve', 'success', 'accomplish', 'target', 'strive'],
  'DETAILS/THOROUGH': ['detail', 'thorough', 'careful', 'meticulous', 'precise', 'accurate', 'perfectionist'],
  'LEADERSHIP/CONTROL': ['lead', 'charge', 'control', 'direct', 'manage', 'authority', 'command'],
  'EMOTIONS/FEELINGS': ['feel', 'emotion', 'upset', 'angry', 'sad', 'happy', 'mood', 'express'],
  'RULES/ETHICS': ['rule', 'law', 'ethic', 'moral', 'principle', 'fair', 'just', 'right', 'wrong'],
};

function findClusters() {
  const clusters = {};
  
  for (const [concept, keywords] of Object.entries(CONCEPT_KEYWORDS)) {
    const matching = allQuestions.filter(q => {
      const text = q.text.toLowerCase();
      return keywords.some(kw => text.includes(kw));
    });
    
    if (matching.length >= 2) {
      clusters[concept] = matching;
    }
  }
  
  return clusters;
}

function calculateSimilarity(text1, text2) {
  // Remove common words
  const stopWords = new Set(['i', 'you', 'the', 'a', 'an', 'to', 'in', 'of', 'and', 'or', 'my', 'is', 'are', 'am', 'when', 'how', 'what', 'that', 'this', 'it', 'for', 'on', 'with', 'as', 'at', 'by', 'be', 'have', 'do', 'would', 'most', 'likely']);
  
  const getWords = (text) => {
    return text.toLowerCase()
      .replace(/[^a-z\s]/g, '')
      .split(/\s+/)
      .filter(w => w.length > 2 && !stopWords.has(w));
  };
  
  const words1 = new Set(getWords(text1));
  const words2 = new Set(getWords(text2));
  
  const intersection = [...words1].filter(x => words2.has(x));
  const union = new Set([...words1, ...words2]);
  
  return {
    score: Math.round((intersection.length / union.size) * 100),
    sharedWords: intersection
  };
}

function findHighlySimilarPairs(threshold = 30) {
  const pairs = [];
  const likertQuestions = allQuestions.filter(q => q.type === 'likert');
  
  for (let i = 0; i < likertQuestions.length; i++) {
    for (let j = i + 1; j < likertQuestions.length; j++) {
      const sim = calculateSimilarity(likertQuestions[i].text, likertQuestions[j].text);
      if (sim.score >= threshold) {
        pairs.push({
          q1: likertQuestions[i],
          q2: likertQuestions[j],
          similarity: sim.score,
          sharedWords: sim.sharedWords
        });
      }
    }
  }
  
  return pairs.sort((a, b) => b.similarity - a.similarity);
}

// MAIN ANALYSIS
console.log('='.repeat(100));
console.log('🔍 CONCEPT CLUSTER ANALYSIS');
console.log('='.repeat(100));

const clusters = findClusters();

// Sort by cluster size (most problematic first)
const sortedClusters = Object.entries(clusters)
  .sort((a, b) => b[1].length - a[1].length);

for (const [concept, questions] of sortedClusters) {
  if (questions.length >= 3) {
    console.log(`\n\n🏷️  ${concept} (${questions.length} questions)`);
    console.log('-'.repeat(90));
    
    // Group by type
    const byType = {};
    questions.forEach(q => {
      byType[q.type] = byType[q.type] || [];
      byType[q.type].push(q);
    });
    
    for (const [type, qs] of Object.entries(byType)) {
      console.log(`\n   📌 ${type.toUpperCase()} (${qs.length}):`);
      qs.forEach((q, i) => {
        const dim = q.dimension || 'unknown';
        const rev = q.reverse_scored ? ' [R]' : '';
        console.log(`      ${i + 1}. [${dim}${rev}] "${q.text.substring(0, 75)}${q.text.length > 75 ? '...' : ''}"`);
      });
    }
  }
}

console.log('\n\n' + '='.repeat(100));
console.log('🔗 HIGH SIMILARITY PAIRS (Likert questions with >30% word overlap)');
console.log('='.repeat(100));

const similarPairs = findHighlySimilarPairs(30);

console.log(`\nFound ${similarPairs.length} similar pairs:\n`);

similarPairs.slice(0, 25).forEach((pair, i) => {
  console.log(`\n${i + 1}. SIMILARITY: ${pair.similarity}% | Shared: [${pair.sharedWords.join(', ')}]`);
  console.log(`   Q1 [${pair.q1.dimension}]: "${pair.q1.text}"`);
  console.log(`   Q2 [${pair.q2.dimension}]: "${pair.q2.text}"`);
});

// REPHRASING SUGGESTIONS
console.log('\n\n' + '='.repeat(100));
console.log('💡 REPHRASING RECOMMENDATIONS');
console.log('='.repeat(100));

const REPHRASE_SUGGESTIONS = `

For questions that are conceptually similar, consider these diverse measurement angles:

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 PLANNING/ORGANIZATION (Conscientiousness)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

INSTEAD OF 5 variations of "I make detailed plans", try measuring DIFFERENT FACETS:

1. PREPARATION BEHAVIOR
   ❌ "I create detailed plans before starting projects."
   ✅ "Before a job interview, I research the company for at least an hour."
   
2. MENTAL REHEARSAL (cognitive planning)
   ❌ "I prepare a detailed checklist before activities."
   ✅ "I mentally walk through important conversations before having them."
   
3. CONTINGENCY THINKING (backup planning)
   ❌ "I struggle without a detailed plan."
   ✅ "I usually know what I'll do if my first approach doesn't work."
   
4. TIME ORIENTATION
   ❌ "I feel comfortable when activities are planned in advance."
   ✅ "I know what I'm doing next weekend."
   
5. SPONTANEITY RESPONSE (reverse)
   ❌ "I prefer days without a schedule."
   ✅ "I enjoy it when a friend calls with unexpected plans."

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔄 CHANGE/ADAPTABILITY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. EMOTIONAL RESPONSE to change
   ❌ "I adapt easily when plans change."
   ✅ "When meetings get rescheduled, I feel annoyed rather than accepting."
   
2. PROACTIVE change-seeking
   ❌ "I am comfortable with change."
   ✅ "I deliberately change my routines to keep things fresh."
   
3. ROLE/IDENTITY flexibility
   ❌ "I adjust quickly to new situations."
   ✅ "I could see myself thriving in a completely different career."
   
4. PROCESS vs OUTCOME focus
   ❌ "I'm flexible with how I work."
   ✅ "I care more about reaching the goal than following the original plan."

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
😰 STRESS/RESILIENCE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. RECOVERY speed
   ❌ "I stay calm under pressure."
   ✅ "After a stressful day, I'm back to normal within an hour."
   
2. PHYSICAL manifestation
   ❌ "I handle stress well."
   ✅ "Stressful situations rarely affect my sleep or appetite."
   
3. COGNITIVE functioning under stress
   ❌ "I remain composed in difficult situations."
   ✅ "I can think clearly even when facing a tight deadline."
   
4. ANTICIPATORY vs REACTIVE stress
   ❌ "I don't worry much."
   ✅ "I rarely lose sleep over upcoming challenges."

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
👥 SOCIAL/EXTRAVERSION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. ENERGY source
   ❌ "I enjoy being around people."
   ✅ "Socializing gives me energy rather than draining it."
   
2. INITIATION behavior
   ❌ "I'm outgoing."
   ✅ "I'm usually the one who texts friends to make plans."
   
3. GROUP SIZE preference
   ❌ "I like social gatherings."
   ✅ "I prefer dinner with 8 people over dinner with 2."
   
4. STRANGER comfort
   ❌ "I'm comfortable in social situations."
   ✅ "I enjoy chatting with people in line at the grocery store."

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🤝 HELPING/AGREEABLENESS  
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. PROACTIVE helping (noticing needs)
   ❌ "I help others when asked."
   ✅ "I notice when coworkers are struggling before they say anything."
   
2. PERSONAL COST tolerance
   ❌ "I'm willing to help others."
   ✅ "I've given up something I wanted so someone else could have it."
   
3. STRANGER vs FAMILIAR
   ❌ "I care about others."
   ✅ "I've significantly helped a stranger I'll never see again."
   
4. EMOTIONAL labor
   ❌ "I support people in need."
   ✅ "I'm the person friends call when they need to vent."
`;

console.log(REPHRASE_SUGGESTIONS);

// Summary
console.log('\n' + '='.repeat(100));
console.log('📊 SUMMARY');
console.log('='.repeat(100));
console.log(`
   Total questions analyzed: ${allQuestions.length}
   Concept clusters found: ${Object.keys(clusters).length}
   Clusters with 4+ questions: ${sortedClusters.filter(([_, qs]) => qs.length >= 4).length}
   High-similarity pairs: ${similarPairs.length}
   
   🎯 TOP PRIORITY CLUSTERS TO DIVERSIFY:
   ${sortedClusters.slice(0, 5).map(([c, qs]) => `   - ${c}: ${qs.length} questions`).join('\n')}
`);

