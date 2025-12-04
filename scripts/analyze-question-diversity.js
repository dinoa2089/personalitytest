/**
 * Analyze Question Diversity & Find Duplicates
 * 
 * This script identifies conceptually similar questions and suggests
 * diverse rephrasing to measure the same traits from different angles.
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Keywords that often indicate conceptual overlap
const CONCEPT_CLUSTERS = {
  'planning': ['plan', 'schedule', 'organize', 'prepare', 'checklist', 'itinerary', 'ahead', 'advance'],
  'social_energy': ['party', 'crowd', 'social', 'gathering', 'people', 'alone', 'solitude', 'quiet'],
  'emotions': ['feel', 'emotion', 'upset', 'angry', 'sad', 'happy', 'mood', 'stress'],
  'risk': ['risk', 'danger', 'safe', 'cautious', 'adventure', 'thrill', 'uncertain'],
  'creativity': ['creative', 'imagination', 'ideas', 'innovative', 'artistic', 'original'],
  'helping': ['help', 'support', 'care', 'assist', 'volunteer', 'others', 'need'],
  'honesty': ['honest', 'truth', 'lie', 'deceive', 'authentic', 'genuine', 'sincere'],
  'deadlines': ['deadline', 'time', 'punctual', 'late', 'early', 'on time'],
  'conflict': ['conflict', 'argument', 'disagree', 'confront', 'avoid', 'harmony'],
  'change': ['change', 'adapt', 'flexible', 'routine', 'new', 'different', 'unexpected'],
  'feedback': ['feedback', 'criticism', 'critique', 'review', 'judgment', 'opinion'],
  'goals': ['goal', 'ambition', 'achieve', 'success', 'accomplish', 'target'],
  'details': ['detail', 'thorough', 'careful', 'meticulous', 'precise', 'accurate'],
  'leadership': ['lead', 'charge', 'control', 'direct', 'manage', 'authority'],
};

function findConceptClusters(questions) {
  const clusters = {};
  
  for (const [concept, keywords] of Object.entries(CONCEPT_CLUSTERS)) {
    clusters[concept] = questions.filter(q => {
      const text = q.text.toLowerCase();
      return keywords.some(kw => text.includes(kw));
    });
  }
  
  return clusters;
}

function calculateSimilarity(text1, text2) {
  const words1 = new Set(text1.toLowerCase().replace(/[^a-z\s]/g, '').split(/\s+/));
  const words2 = new Set(text2.toLowerCase().replace(/[^a-z\s]/g, '').split(/\s+/));
  
  const intersection = new Set([...words1].filter(x => words2.has(x)));
  const union = new Set([...words1, ...words2]);
  
  // Jaccard similarity
  return intersection.size / union.size;
}

function findSimilarPairs(questions, threshold = 0.4) {
  const pairs = [];
  
  for (let i = 0; i < questions.length; i++) {
    for (let j = i + 1; j < questions.length; j++) {
      const similarity = calculateSimilarity(questions[i].text, questions[j].text);
      if (similarity >= threshold) {
        pairs.push({
          q1: questions[i],
          q2: questions[j],
          similarity: Math.round(similarity * 100),
        });
      }
    }
  }
  
  return pairs.sort((a, b) => b.similarity - a.similarity);
}

async function analyzeDatabase() {
  console.log('🔍 Fetching all questions from database...\n');
  
  const { data: questions, error } = await supabase
    .from('questions')
    .select('id, text, type, dimension, reverse_scored')
    .order('dimension');
  
  if (error) {
    console.error('❌ Error:', error);
    return;
  }

  console.log(`📊 Total questions: ${questions.length}\n`);
  console.log('='.repeat(100));

  // 1. Find concept clusters
  console.log('\n📋 CONCEPT CLUSTER ANALYSIS\n');
  const clusters = findConceptClusters(questions);
  
  const problematicClusters = [];
  
  for (const [concept, clusterQuestions] of Object.entries(clusters)) {
    if (clusterQuestions.length >= 3) {
      console.log(`\n🏷️  ${concept.toUpperCase()} (${clusterQuestions.length} questions)`);
      console.log('-'.repeat(80));
      
      clusterQuestions.forEach((q, i) => {
        console.log(`   ${i + 1}. [${q.type}/${q.dimension}] "${q.text.substring(0, 80)}${q.text.length > 80 ? '...' : ''}"`);
      });
      
      if (clusterQuestions.length >= 4) {
        problematicClusters.push({ concept, questions: clusterQuestions });
      }
    }
  }

  // 2. Find high-similarity pairs
  console.log('\n\n' + '='.repeat(100));
  console.log('\n🔗 HIGH SIMILARITY PAIRS (>40% word overlap)\n');
  
  const similarPairs = findSimilarPairs(questions, 0.35);
  
  if (similarPairs.length === 0) {
    console.log('   ✅ No highly similar pairs found!');
  } else {
    similarPairs.slice(0, 20).forEach((pair, i) => {
      console.log(`\n${i + 1}. SIMILARITY: ${pair.similarity}%`);
      console.log(`   Q1 [${pair.q1.dimension}]: "${pair.q1.text.substring(0, 70)}..."`);
      console.log(`   Q2 [${pair.q2.dimension}]: "${pair.q2.text.substring(0, 70)}..."`);
    });
  }

  // 3. Dimension balance check
  console.log('\n\n' + '='.repeat(100));
  console.log('\n📊 DIMENSION BALANCE\n');
  
  const dimCounts = {};
  questions.forEach(q => {
    dimCounts[q.dimension] = (dimCounts[q.dimension] || 0) + 1;
  });
  
  const avgCount = Object.values(dimCounts).reduce((a, b) => a + b, 0) / Object.keys(dimCounts).length;
  
  Object.entries(dimCounts)
    .sort((a, b) => b[1] - a[1])
    .forEach(([dim, count]) => {
      const bar = '█'.repeat(Math.round(count / 2));
      const status = count < avgCount * 0.7 ? '⚠️ LOW' : count > avgCount * 1.3 ? '⚠️ HIGH' : '✅';
      console.log(`   ${dim.padEnd(20)} ${String(count).padStart(3)} ${bar} ${status}`);
    });

  // 4. Return data for rephrasing suggestions
  return { questions, clusters, similarPairs, problematicClusters };
}

// Rephrasing suggestions for common duplicate patterns
const REPHRASING_SUGGESTIONS = {
  'planning': {
    original_concept: 'Making detailed plans before activities',
    diverse_angles: [
      { 
        angle: 'Time horizon',
        current: 'I create detailed plans before starting projects.',
        suggested: 'I think about tomorrow\'s tasks before going to bed each night.',
        rationale: 'Measures planning tendency via daily habit rather than project planning'
      },
      {
        angle: 'Spontaneity comfort',
        current: 'I prefer to approach my day without a specific schedule or plan.',
        suggested: 'I enjoy it when friends suggest last-minute weekend trips.',
        rationale: 'Measures comfort with unplanned activities in social context'
      },
      {
        angle: 'Backup planning',
        current: 'I struggle to take action when I do not have a detailed plan in place.',
        suggested: 'I usually have a Plan B ready in case my first approach doesn\'t work.',
        rationale: 'Measures contingency thinking rather than paralysis without plans'
      },
      {
        angle: 'Mental preparation',
        current: 'I prepare a detailed checklist or itinerary before starting a complex activity.',
        suggested: 'I mentally walk through upcoming events before they happen.',
        rationale: 'Measures cognitive preparation rather than written planning'
      },
      {
        angle: 'Comfort with ambiguity',
        current: 'I feel most comfortable when my daily activities are planned out in advance.',
        suggested: 'Open-ended days with no agenda make me feel uneasy.',
        rationale: 'Measures emotional response to lack of structure'
      },
    ]
  },
  'social_energy': {
    original_concept: 'Energy from social vs solitary activities',
    diverse_angles: [
      {
        angle: 'Recovery method',
        current: 'I prefer spending time alone to recharge.',
        suggested: 'After a demanding week, I look forward to a quiet weekend at home.',
        rationale: 'Measures recovery preference in specific context'
      },
      {
        angle: 'Group size preference',
        current: 'I enjoy being the center of attention at social gatherings.',
        suggested: 'I prefer one-on-one conversations to group discussions.',
        rationale: 'Measures social style rather than just introversion/extraversion'
      },
      {
        angle: 'Initiative in socializing',
        current: 'I often initiate conversations with strangers.',
        suggested: 'I\'m usually the one who suggests getting together with friends.',
        rationale: 'Measures social initiative with familiar people, not just strangers'
      },
    ]
  },
  'change': {
    original_concept: 'Adaptability to change',
    diverse_angles: [
      {
        angle: 'Emotional response',
        current: 'I easily adjust my plans when circumstances change.',
        suggested: 'Unexpected changes to my routine leave me feeling energized rather than frustrated.',
        rationale: 'Measures emotional reaction rather than behavioral adaptation'
      },
      {
        angle: 'Learning new things',
        current: 'I adapt quickly to new situations.',
        suggested: 'I enjoy learning new software or tools even when my current ones work fine.',
        rationale: 'Measures proactive change-seeking rather than reactive adaptation'
      },
      {
        angle: 'Role flexibility',
        current: 'I am comfortable with change.',
        suggested: 'I would be excited to take on a completely different role at work.',
        rationale: 'Measures comfort with major life changes, not just daily adjustments'
      },
    ]
  },
  'helping': {
    original_concept: 'Tendency to help others',
    diverse_angles: [
      {
        angle: 'Proactive vs reactive',
        current: 'I often help others without being asked.',
        suggested: 'I notice when colleagues are struggling before they say anything.',
        rationale: 'Measures perceptiveness to others\' needs rather than just helping behavior'
      },
      {
        angle: 'Personal cost',
        current: 'I volunteer to help even when it inconveniences me.',
        suggested: 'I\'ve missed personal events to help someone in need.',
        rationale: 'Measures willingness to sacrifice with concrete example'
      },
      {
        angle: 'Stranger vs familiar',
        current: 'I care about others\' wellbeing.',
        suggested: 'I\'ve helped a stranger with something that took significant time.',
        rationale: 'Measures helping beyond social circle'
      },
    ]
  },
};

function printRephrasingSuggestions() {
  console.log('\n\n' + '='.repeat(100));
  console.log('\n💡 REPHRASING SUGGESTIONS FOR DUPLICATE CONCEPTS\n');
  
  for (const [concept, data] of Object.entries(REPHRASING_SUGGESTIONS)) {
    console.log(`\n🏷️  ${concept.toUpperCase()}`);
    console.log(`   Original concept: ${data.original_concept}`);
    console.log('-'.repeat(90));
    
    data.diverse_angles.forEach((angle, i) => {
      console.log(`\n   ${i + 1}. ANGLE: ${angle.angle}`);
      console.log(`      CURRENT:   "${angle.current}"`);
      console.log(`      SUGGESTED: "${angle.suggested}"`);
      console.log(`      WHY:       ${angle.rationale}`);
    });
  }
}

async function main() {
  console.log('🧪 Question Diversity Analyzer\n');
  console.log('This tool identifies conceptually similar questions and suggests');
  console.log('diverse rephrasing to measure the same traits from different angles.\n');
  console.log('='.repeat(100));
  
  const analysis = await analyzeDatabase();
  
  if (analysis) {
    printRephrasingSuggestions();
    
    console.log('\n\n' + '='.repeat(100));
    console.log('\n📋 SUMMARY\n');
    console.log(`   Total questions analyzed: ${analysis.questions.length}`);
    console.log(`   Concept clusters with 4+ questions: ${analysis.problematicClusters.length}`);
    console.log(`   High-similarity pairs found: ${analysis.similarPairs.length}`);
    console.log('\n   Run this script periodically to maintain question diversity.');
  }
}

main().catch(console.error);


