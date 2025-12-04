const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://eqkcmlxxuubibzoqliee.supabase.co', 
  'sb_secret_tCzyDalDHDI-iQqxGXx6Nw_qyb5kJej'
);

async function analyzeMBTI() {
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
  
  console.log('=== MBTI J/P ANALYSIS ===\n');
  console.log('Your result: J/P score 41 → P (should be J for ENTJ)\n');
  
  // Find MBTI-tagged questions
  console.log('--- Direct MBTI Questions ---');
  const mbtiQuestions = questions.filter(q => 
    q.framework_tags && 
    (q.framework_tags.includes('mbti_jp') || 
     q.framework_tags.some && q.framework_tags.some(t => t.includes('mbti_jp')))
  );
  
  if (mbtiQuestions.length === 0) {
    console.log('No direct MBTI J/P tagged questions found in your assessment');
  } else {
    mbtiQuestions.forEach(q => {
      const resp = responses.find(r => r.question_id === q.id);
      console.log(`\nQ: ${q.text.substring(0, 100)}`);
      console.log(`Tags: ${JSON.stringify(q.framework_tags)}`);
      console.log(`Response: ${JSON.stringify(resp?.response)}`);
    });
  }
  
  // Analyze conscientiousness responses (maps to J)
  console.log('\n\n--- Conscientiousness Responses (high = J) ---');
  const conscResponses = responses.filter(r => r.dimension === 'conscientiousness');
  let conscTotal = 0;
  let conscCount = 0;
  
  conscResponses.forEach(r => {
    const q = qMap[r.question_id];
    let value = r.response?.value;
    
    // For likert, normalize to 0-100
    if (typeof value === 'number') {
      // Likert 1-7 scale
      let normalized = ((value - 1) / 6) * 100;
      if (q?.reverse_scored) {
        normalized = 100 - normalized;
      }
      conscTotal += normalized;
      conscCount++;
      
      const jOrP = normalized > 50 ? 'J' : 'P';
      console.log(`${q?.text?.substring(0, 60)}...`);
      console.log(`  Response: ${value}/7 ${q?.reverse_scored ? '(reversed)' : ''} → ${normalized.toFixed(0)}% → ${jOrP}`);
    }
  });
  
  if (conscCount > 0) {
    console.log(`\nConsc Average: ${(conscTotal/conscCount).toFixed(1)}%`);
  }
  
  // Analyze adaptability responses (high = P, inverted for J)
  console.log('\n\n--- Adaptability Responses (low = J) ---');
  const adaptResponses = responses.filter(r => r.dimension === 'adaptability');
  let adaptTotal = 0;
  let adaptCount = 0;
  
  adaptResponses.forEach(r => {
    const q = qMap[r.question_id];
    let value = r.response?.value;
    
    if (typeof value === 'number') {
      let normalized = ((value - 1) / 6) * 100;
      if (q?.reverse_scored) {
        normalized = 100 - normalized;
      }
      adaptTotal += normalized;
      adaptCount++;
      
      // For J/P: LOW adaptability = J
      const jOrP = normalized < 50 ? 'J' : 'P';
      console.log(`${q?.text?.substring(0, 60)}...`);
      console.log(`  Response: ${value}/7 ${q?.reverse_scored ? '(reversed)' : ''} → ${normalized.toFixed(0)}% adapt → ${jOrP}`);
    }
  });
  
  if (adaptCount > 0) {
    console.log(`\nAdapt Average: ${(adaptTotal/adaptCount).toFixed(1)}%`);
  }
  
  // Calculate what J/P should be
  console.log('\n\n=== MBTI J/P CALCULATION ===');
  const conscAvg = conscCount > 0 ? conscTotal / conscCount : 50;
  const adaptAvg = adaptCount > 0 ? adaptTotal / adaptCount : 50;
  
  // Current formula: J = conscientiousness * 0.6 + (100 - adaptability) * 0.4
  const jpScore = conscAvg * 0.6 + (100 - adaptAvg) * 0.4;
  
  console.log(`Conscientiousness: ${conscAvg.toFixed(1)}%`);
  console.log(`Adaptability: ${adaptAvg.toFixed(1)}%`);
  console.log(`J/P Score = ${conscAvg.toFixed(1)} * 0.6 + (100 - ${adaptAvg.toFixed(1)}) * 0.4 = ${jpScore.toFixed(1)}`);
  console.log(`Result: ${jpScore > 50 ? 'J (Judging)' : 'P (Perceiving)'}`);
  
  // The stored result
  console.log('\n--- Stored Result ---');
  const { data: results } = await supabase
    .from('assessment_results')
    .select('framework_mappings')
    .eq('session_id', sessionId)
    .single();
  
  console.log('MBTI from DB:', JSON.stringify(results?.framework_mappings?.mbti, null, 2));
}

analyzeMBTI().catch(console.error);

