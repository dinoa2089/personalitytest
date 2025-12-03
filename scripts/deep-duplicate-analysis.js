/**
 * Deep Duplicate Question Analysis
 * 
 * Examines EVERY question individually and identifies:
 * 1. Exact phrase duplicates
 * 2. Conceptually similar questions
 * 3. Questions that could be rephrased from different angles
 */

const fs = require('fs');
const path = require('path');

// Load questions
const questionsFile = path.join(__dirname, '..', 'questions_export.json');
let fileContent = fs.readFileSync(questionsFile, 'utf8');
if (fileContent.charCodeAt(0) === 0xFEFF) {
  fileContent = fileContent.slice(1);
}
const data = JSON.parse(fileContent);

// Extract all questions
let allQuestions = [];
if (data.questions) {
  allQuestions = data.questions;
} else if (Array.isArray(data)) {
  allQuestions = data;
} else {
  for (const key of Object.keys(data)) {
    if (Array.isArray(data[key])) {
      allQuestions.push(...data[key]);
    }
  }
}

// Filter to only likert/behavioral_frequency (the repetitive ones)
const textQuestions = allQuestions.filter(q => 
  q.type === 'likert' || q.type === 'behavioral_frequency'
);

console.log(`\n📊 Analyzing ${textQuestions.length} Likert/Behavioral questions for duplicates...\n`);
console.log('='.repeat(120));

// Stop words to ignore
const stopWords = new Set([
  'i', 'me', 'my', 'myself', 'we', 'our', 'you', 'your', 'he', 'she', 'it', 'they',
  'the', 'a', 'an', 'to', 'in', 'of', 'and', 'or', 'is', 'are', 'am', 'was', 'were',
  'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would',
  'could', 'should', 'may', 'might', 'must', 'shall', 'can', 'that', 'this', 'these',
  'those', 'what', 'which', 'who', 'whom', 'when', 'where', 'why', 'how', 'all', 'each',
  'every', 'both', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'not', 'only',
  'own', 'same', 'so', 'than', 'too', 'very', 'just', 'but', 'if', 'because', 'as',
  'until', 'while', 'for', 'with', 'about', 'against', 'between', 'into', 'through',
  'during', 'before', 'after', 'above', 'below', 'from', 'up', 'down', 'out', 'off',
  'over', 'under', 'again', 'further', 'then', 'once', 'here', 'there', 'when', 'where',
  'why', 'how', 'any', 'at', 'by', 'on', 'often', 'even', 'also', 'like', 'likely',
  'feel', 'feeling', 'felt', 'find', 'think', 'tend', 'usually', 'sometimes', 'always',
  'never', 'rarely', 'frequently', 'past', 'month', 'week', 'time', 'times', 'others',
  'someone', 'people', 'person', 'make', 'take', 'get', 'give', 'go', 'come', 'see',
  'know', 'want', 'use', 'work', 'first', 'new', 'way', 'long', 'little', 'own', 'well',
  'most', 'after', 'things', 'thing'
]);

// Extract meaningful keywords from text
function extractKeywords(text) {
  return text.toLowerCase()
    .replace(/[^a-z\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 3 && !stopWords.has(w));
}

// Calculate similarity between two questions
function calculateSimilarity(q1, q2) {
  const kw1 = new Set(extractKeywords(q1.text));
  const kw2 = new Set(extractKeywords(q2.text));
  
  const intersection = [...kw1].filter(x => kw2.has(x));
  const union = new Set([...kw1, ...kw2]);
  
  const jaccardSimilarity = intersection.length / union.size;
  
  // Also check for exact phrase matches
  const phrases1 = extractPhrases(q1.text);
  const phrases2 = extractPhrases(q2.text);
  const phraseMatches = phrases1.filter(p => phrases2.includes(p));
  
  return {
    similarity: Math.round(jaccardSimilarity * 100),
    sharedKeywords: intersection,
    sharedPhrases: phraseMatches
  };
}

// Extract 2-3 word phrases
function extractPhrases(text) {
  const words = text.toLowerCase().replace(/[^a-z\s]/g, '').split(/\s+/);
  const phrases = [];
  for (let i = 0; i < words.length - 1; i++) {
    phrases.push(`${words[i]} ${words[i+1]}`);
    if (i < words.length - 2) {
      phrases.push(`${words[i]} ${words[i+1]} ${words[i+2]}`);
    }
  }
  return phrases.filter(p => !stopWords.has(p.split(' ')[0]) && !stopWords.has(p.split(' ')[1]));
}

// Group questions by key concepts
const conceptGroups = {};
const conceptKeywords = {
  // Planning & Organization
  'PLANNING': ['plan', 'plans', 'planning', 'schedule', 'organize', 'organized', 'checklist', 'prepare', 'preparation', 'itinerary', 'advance', 'ahead'],
  'ROUTINE': ['routine', 'routines', 'daily', 'consistent', 'regular', 'habit', 'habits'],
  'GOALS': ['goal', 'goals', 'target', 'achieve', 'achievement', 'accomplish', 'ambition', 'ambitious'],
  'DEADLINES': ['deadline', 'deadlines', 'time', 'punctual', 'late', 'early', 'submit', 'complete'],
  'DETAILS': ['detail', 'details', 'detailed', 'thorough', 'careful', 'meticulous', 'precise', 'accurate'],
  'TASKS': ['task', 'tasks', 'finish', 'finished', 'unfinished', 'complete', 'completed'],
  
  // Social & Interpersonal
  'SOCIAL_GATHERINGS': ['party', 'parties', 'gathering', 'gatherings', 'social', 'crowd', 'crowds', 'group', 'groups'],
  'CONVERSATION': ['conversation', 'conversations', 'talk', 'talking', 'speak', 'speaking', 'discuss', 'chat'],
  'ALONE': ['alone', 'solitude', 'quiet', 'independently', 'solitary', 'isolation', 'withdrawn'],
  'HELPING': ['help', 'helping', 'support', 'supporting', 'assist', 'care', 'caring', 'volunteer'],
  'CONFLICT': ['conflict', 'argument', 'argue', 'disagree', 'disagreement', 'confront', 'confrontation', 'tension'],
  
  // Emotional
  'STRESS': ['stress', 'stressed', 'stressful', 'pressure', 'pressured', 'overwhelm', 'overwhelmed', 'anxious', 'anxiety'],
  'CALM': ['calm', 'composed', 'composure', 'relaxed', 'peaceful', 'serene', 'stable'],
  'EMOTIONS': ['emotion', 'emotions', 'emotional', 'feelings', 'mood', 'moods', 'upset', 'angry'],
  'WORRY': ['worry', 'worrying', 'worried', 'concern', 'concerned', 'nervous', 'fear'],
  
  // Adaptability & Change
  'CHANGE': ['change', 'changes', 'changing', 'adapt', 'adapting', 'adjust', 'adjusting', 'flexible', 'flexibility'],
  'NEW_EXPERIENCES': ['new', 'novel', 'unfamiliar', 'different', 'explore', 'exploring', 'adventure', 'adventurous'],
  'SPONTANEOUS': ['spontaneous', 'spontaneity', 'unexpected', 'unplanned', 'impromptu', 'impulsive'],
  
  // Work & Achievement  
  'LEADERSHIP': ['lead', 'leader', 'leading', 'charge', 'control', 'direct', 'directing', 'manage', 'authority'],
  'FEEDBACK': ['feedback', 'criticism', 'critique', 'review', 'evaluate', 'evaluation', 'opinion'],
  'MISTAKES': ['mistake', 'mistakes', 'error', 'errors', 'wrong', 'fail', 'failure', 'setback'],
  'SUCCESS': ['success', 'successful', 'accomplish', 'achievement', 'recognition', 'credit', 'praise'],
  
  // Values & Ethics
  'HONESTY': ['honest', 'honesty', 'truth', 'truthful', 'lie', 'lying', 'deceive', 'authentic'],
  'RULES': ['rule', 'rules', 'law', 'laws', 'regulation', 'policy', 'ethical', 'principles'],
  'FAIRNESS': ['fair', 'fairness', 'equal', 'equality', 'justice', 'advantage', 'disadvantage'],
};

// Categorize each question
textQuestions.forEach(q => {
  const text = q.text.toLowerCase();
  const matchedConcepts = [];
  
  for (const [concept, keywords] of Object.entries(conceptKeywords)) {
    if (keywords.some(kw => text.includes(kw))) {
      matchedConcepts.push(concept);
      if (!conceptGroups[concept]) {
        conceptGroups[concept] = [];
      }
      conceptGroups[concept].push(q);
    }
  }
});

// Find high-similarity pairs
const similarPairs = [];
for (let i = 0; i < textQuestions.length; i++) {
  for (let j = i + 1; j < textQuestions.length; j++) {
    const sim = calculateSimilarity(textQuestions[i], textQuestions[j]);
    if (sim.similarity >= 35 || sim.sharedPhrases.length >= 2) {
      similarPairs.push({
        q1: textQuestions[i],
        q2: textQuestions[j],
        ...sim
      });
    }
  }
}

similarPairs.sort((a, b) => b.similarity - a.similarity);

// Print results
console.log('\n🔴 HIGH PRIORITY: VERY SIMILAR QUESTIONS (>40% keyword overlap)\n');
console.log('These questions are asking essentially the same thing and should be rephrased:\n');

let priorityCount = 0;
similarPairs.filter(p => p.similarity >= 40).forEach((pair, i) => {
  priorityCount++;
  console.log(`\n${priorityCount}. SIMILARITY: ${pair.similarity}%`);
  console.log(`   Shared keywords: [${pair.sharedKeywords.join(', ')}]`);
  console.log(`   ┌─ [${pair.q1.dimension}] "${pair.q1.text}"`);
  console.log(`   └─ [${pair.q2.dimension}] "${pair.q2.text}"`);
});

console.log('\n\n' + '='.repeat(120));
console.log('\n🟡 MEDIUM PRIORITY: CONCEPTUALLY SIMILAR (35-40% overlap)\n');

similarPairs.filter(p => p.similarity >= 35 && p.similarity < 40).slice(0, 20).forEach((pair, i) => {
  console.log(`\n${i + 1}. SIMILARITY: ${pair.similarity}%`);
  console.log(`   Shared: [${pair.sharedKeywords.slice(0, 5).join(', ')}]`);
  console.log(`   ┌─ [${pair.q1.dimension}] "${pair.q1.text.substring(0, 80)}..."`);
  console.log(`   └─ [${pair.q2.dimension}] "${pair.q2.text.substring(0, 80)}..."`);
});

console.log('\n\n' + '='.repeat(120));
console.log('\n📋 CONCEPT CLUSTERS WITH 4+ QUESTIONS (potential over-representation)\n');

const sortedConcepts = Object.entries(conceptGroups)
  .filter(([_, qs]) => qs.length >= 4)
  .sort((a, b) => b[1].length - a[1].length);

for (const [concept, questions] of sortedConcepts) {
  console.log(`\n🏷️  ${concept} (${questions.length} questions)`);
  questions.forEach((q, i) => {
    const short = q.text.length > 90 ? q.text.substring(0, 90) + '...' : q.text;
    console.log(`   ${i + 1}. [${q.dimension}${q.reverse_scored ? '/R' : ''}] "${short}"`);
  });
}

// Generate rephrasing suggestions
console.log('\n\n' + '='.repeat(120));
console.log('\n💡 REPHRASING RECOMMENDATIONS\n');

const rephraseMap = {
  'PLANNING': {
    angles: [
      { current: 'making detailed plans/checklists', better: 'Mental rehearsal - "I mentally walk through events before they happen"' },
      { current: 'feeling comfortable with plans', better: 'Time horizon - "I know what I\'m doing next weekend"' },
      { current: 'struggling without plans', better: 'Backup thinking - "I have a Plan B ready when starting projects"' },
      { current: 'preferring schedules', better: 'Energy management - "I block out time for deep work vs meetings"' },
    ]
  },
  'STRESS': {
    angles: [
      { current: 'feeling stressed/overwhelmed', better: 'Physical impact - "Stressful days rarely affect my sleep"' },
      { current: 'remaining calm', better: 'Recovery speed - "I bounce back within hours after a setback"' },
      { current: 'handling pressure', better: 'Cognitive clarity - "I can think clearly even with tight deadlines"' },
      { current: 'worrying', better: 'Anticipatory vs reactive - "I rarely lose sleep over upcoming challenges"' },
    ]
  },
  'SOCIAL_GATHERINGS': {
    angles: [
      { current: 'enjoying/avoiding parties', better: 'Energy source - "Socializing energizes rather than drains me"' },
      { current: 'feeling drained by groups', better: 'Group size - "I prefer dinner with 6 over dinner with 2"' },
      { current: 'initiating with strangers', better: 'Initiative with friends - "I usually suggest getting together"' },
      { current: 'blending in at gatherings', better: 'Stranger comfort - "I chat with people in grocery lines"' },
    ]
  },
  'HELPING': {
    angles: [
      { current: 'helping when asked', better: 'Proactive - "I notice when coworkers struggle before they say"' },
      { current: 'willing to help', better: 'Personal cost - "I\'ve given up something I wanted for someone else"' },
      { current: 'caring about others', better: 'Stranger vs familiar - "I\'ve significantly helped strangers"' },
      { current: 'supporting people', better: 'Emotional labor - "Friends call me when they need to vent"' },
    ]
  },
  'CHANGE': {
    angles: [
      { current: 'adapting to change', better: 'Emotional response - "Rescheduled meetings frustrate vs accept"' },
      { current: 'comfortable with change', better: 'Proactive - "I deliberately change routines to stay fresh"' },
      { current: 'adjusting quickly', better: 'Role flexibility - "I could thrive in a completely different career"' },
      { current: 'flexible with how I work', better: 'Process vs outcome - "I care more about the goal than the plan"' },
    ]
  },
  'ROUTINE': {
    angles: [
      { current: 'preferring routines', better: 'Disruption response - "I recover quickly when my morning routine breaks"' },
      { current: 'sticking to habits', better: 'Intentional change - "I update my routines every few months"' },
      { current: 'daily consistency', better: 'Context switching - "I can shift between very different tasks easily"' },
    ]
  },
  'EMOTIONS': {
    angles: [
      { current: 'expressing emotions', better: 'Timing - "I process emotions privately before sharing"' },
      { current: 'controlling emotions', better: 'Physical signals - "I notice body tension before I feel stressed"' },
      { current: 'emotional impact', better: 'Duration - "Strong emotions fade within hours for me"' },
    ]
  },
};

for (const [concept, data] of Object.entries(rephraseMap)) {
  if (conceptGroups[concept]?.length >= 3) {
    console.log(`\n📝 ${concept} (${conceptGroups[concept]?.length || 0} questions)`);
    console.log('   Instead of asking the same concept multiple ways, try these angles:');
    data.angles.forEach((a, i) => {
      console.log(`   ${i + 1}. ❌ "${a.current}" → ✅ ${a.better}`);
    });
  }
}

// Summary
console.log('\n\n' + '='.repeat(120));
console.log('\n📊 SUMMARY\n');
console.log(`   Total Likert/Behavioral questions: ${textQuestions.length}`);
console.log(`   High-similarity pairs (>40%): ${similarPairs.filter(p => p.similarity >= 40).length}`);
console.log(`   Medium-similarity pairs (35-40%): ${similarPairs.filter(p => p.similarity >= 35 && p.similarity < 40).length}`);
console.log(`   Concept clusters with 4+ questions: ${sortedConcepts.length}`);
console.log('\n   🎯 TOP PRIORITY FIXES:');
similarPairs.filter(p => p.similarity >= 45).forEach(p => {
  console.log(`   - "${p.q1.text.substring(0, 50)}..." (${p.similarity}% similar)`);
});

console.log('\n');

