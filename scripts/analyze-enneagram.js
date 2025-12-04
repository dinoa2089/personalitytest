const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://eqkcmlxxuubibzoqliee.supabase.co', 
  'sb_secret_tCzyDalDHDI-iQqxGXx6Nw_qyb5kJej'
);

async function analyzeEnneagram() {
  const sessionId = '71ff03af-fe2f-4057-ae40-6f8424838904';
  
  // Get all responses
  const { data: responses } = await supabase
    .from('assessment_responses')
    .select('question_id, response, dimension')
    .eq('session_id', sessionId);
  
  // Get questions with framework tags
  const questionIds = responses.map(r => r.question_id);
  const { data: questions } = await supabase
    .from('questions')
    .select('id, text, dimension, type, reverse_scored, framework_tags')
    .in('id', questionIds);
  
  const qMap = {};
  questions.forEach(q => { qMap[q.id] = q; });
  
  console.log('=== ENNEAGRAM ANALYSIS ===\n');
  console.log('Your result: Type 7 (Enthusiast) with wing 8');
  console.log('Expected: Type 3 (Achiever)\n');
  
  // Find Enneagram-tagged questions
  console.log('--- Enneagram-Tagged Questions By Type ---\n');
  
  for (let type = 1; type <= 9; type++) {
    const tag = `enneagram_${type}`;
    const typeQuestions = questions.filter(q => 
      q.framework_tags && q.framework_tags.includes(tag)
    );
    
    if (typeQuestions.length > 0) {
      const typeNames = {
        1: 'Perfectionist', 2: 'Helper', 3: 'Achiever', 4: 'Individualist',
        5: 'Investigator', 6: 'Loyalist', 7: 'Enthusiast', 8: 'Challenger', 9: 'Peacemaker'
      };
      
      console.log(`\n=== TYPE ${type}: ${typeNames[type]} ===`);
      
      let totalScore = 0;
      let count = 0;
      
      typeQuestions.forEach(q => {
        const resp = responses.find(r => r.question_id === q.id);
        const value = resp?.response?.value;
        
        if (typeof value === 'number') {
          // Normalize to 0-100
          let normalized = ((value - 1) / 6) * 100;
          if (q.reverse_scored) {
            normalized = 100 - normalized;
          }
          totalScore += normalized;
          count++;
          
          console.log(`Q: ${q.text.substring(0, 70)}...`);
          console.log(`   Answer: ${value}/7 ${q.reverse_scored ? '(REVERSE)' : ''} → ${normalized.toFixed(0)}%`);
        }
      });
      
      if (count > 0) {
        console.log(`\n   TYPE ${type} AVERAGE: ${(totalScore/count).toFixed(1)}%`);
      }
    }
  }
  
  // Show stored result
  console.log('\n\n--- Stored Enneagram Result ---');
  const { data: results } = await supabase
    .from('assessment_results')
    .select('framework_mappings')
    .eq('session_id', sessionId)
    .single();
  
  const enn = results?.framework_mappings?.enneagram;
  console.log('Primary Type:', enn?.primary_type, `(${enn?.primary_probability}%)`);
  console.log('Wing:', enn?.wing);
  console.log('\nAll probabilities:');
  if (enn?.all_probabilities) {
    Object.entries(enn.all_probabilities)
      .sort((a, b) => b[1] - a[1])
      .forEach(([type, prob]) => {
        const names = { 1: 'Perfectionist', 2: 'Helper', 3: 'Achiever', 4: 'Individualist',
          5: 'Investigator', 6: 'Loyalist', 7: 'Enthusiast', 8: 'Challenger', 9: 'Peacemaker' };
        console.log(`  Type ${type} (${names[type]}): ${prob}%`);
      });
  }
}

analyzeEnneagram().catch(console.error);

