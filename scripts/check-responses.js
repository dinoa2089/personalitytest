const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://eqkcmlxxuubibzoqliee.supabase.co', 
  'sb_secret_tCzyDalDHDI-iQqxGXx6Nw_qyb5kJej'
);

async function run() {
  // Check all users
  const { data: users } = await supabase
    .from('users')
    .select('id, email, clerk_id, created_at')
    .order('created_at', { ascending: false })
    .limit(10);
  console.log('Recent users:', JSON.stringify(users, null, 2));
  
  // Get responses with questions
  const { data: responses, error } = await supabase
    .from('assessment_responses')
    .select('id, question_id, response, dimension, created_at')
    .eq('session_id', '71ff03af-fe2f-4057-ae40-6f8424838904')
    .order('created_at', { ascending: true });
  
  if (error) {
    console.log('Response error:', error);
    return;
  }
  
  console.log('\nTotal responses:', responses?.length);
  
  // Get questions
  const questionIds = responses.map(r => r.question_id);
  const { data: questions } = await supabase
    .from('questions')
    .select('*')
    .in('id', questionIds);
  
  const qMap = {};
  questions?.forEach(q => { qMap[q.id] = q; });
  
  console.log('\n=== YOUR RESPONSES ===\n');
  responses?.forEach((r, i) => {
    const q = qMap[r.question_id];
    console.log(`--- Question ${i+1} ---`);
    console.log(`Text: ${q?.text?.substring(0, 100)}`);
    console.log(`Type: ${q?.type} | Dimension: ${r.dimension} | Reverse: ${q?.reverse_scored}`);
    console.log(`Your Response: ${JSON.stringify(r.response)}`);
    console.log('');
  });
  
  // Summary by dimension
  console.log('\n=== RESPONSES BY DIMENSION ===');
  const byDim = {};
  responses?.forEach(r => { 
    if (!byDim[r.dimension]) byDim[r.dimension] = [];
    const q = qMap[r.question_id];
    byDim[r.dimension].push({
      response: r.response,
      reverse: q?.reverse_scored,
      type: q?.type
    });
  });
  
  for (const [dim, resps] of Object.entries(byDim)) {
    console.log(`\n${dim}: ${resps.length} responses`);
    resps.forEach((r, i) => {
      const val = typeof r.response === 'object' ? JSON.stringify(r.response) : r.response;
      console.log(`  ${i+1}. ${val} (${r.type}${r.reverse ? ', REVERSE' : ''})`);
    });
  }
}

run().catch(console.error);

