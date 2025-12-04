/**
 * Script to verify Dean's assessment results
 * Run with: node scripts/verify-dean-results.js
 */
require('dotenv').config({ path: '.env.local' });

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials. Check .env.local');
  console.log('Required: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);
const userEmail = 'dean@beanstalkconsulting.co';

async function verifyResults() {
  console.log('\n========================================');
  console.log('  VERIFYING ASSESSMENT RESULTS');
  console.log('  Email:', userEmail);
  console.log('========================================\n');
  
  // 1. Find user by email
  const { data: users, error: userError } = await supabase
    .from('users')
    .select('*')
    .eq('email', userEmail);
    
  if (userError || !users?.length) {
    console.error('User not found:', userError?.message || 'No user with that email');
    return;
  }
  
  const user = users[0];
  console.log('✓ User found:', user.id);
  console.log('  Created:', user.created_at);
  
  // 2. Get most recent assessment session
  const { data: sessions, error: sessionError } = await supabase
    .from('assessment_sessions')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(5);
    
  if (sessionError || !sessions?.length) {
    console.error('No sessions found:', sessionError?.message);
    return;
  }
  
  console.log(`\n✓ Found ${sessions.length} session(s)`);
  
  const latestSession = sessions[0];
  console.log('\n--- Most Recent Session ---');
  console.log('  Session ID:', latestSession.id);
  console.log('  Started:', latestSession.started_at);
  console.log('  Completed:', latestSession.completed_at);
  console.log('  Progress:', latestSession.progress + '%');
  
  // 3. Get responses for latest session
  const { data: responses, error: respError } = await supabase
    .from('assessment_responses')
    .select(`
      id,
      question_id,
      response,
      dimension,
      question_type,
      timestamp
    `)
    .eq('session_id', latestSession.id)
    .order('timestamp', { ascending: true });
    
  if (respError) {
    console.error('Responses error:', respError.message);
    return;
  }
  
  console.log(`\n✓ Found ${responses?.length || 0} responses\n`);
  
  // Get questions for context
  const questionIds = responses?.map(r => r.question_id) || [];
  const { data: questions } = await supabase
    .from('questions')
    .select('id, text, type, dimension, reverse_scored, weight')
    .in('id', questionIds);
    
  const qMap = {};
  questions?.forEach(q => { qMap[q.id] = q; });
  
  // Group responses by dimension
  const byDimension = {};
  responses?.forEach(r => {
    if (!byDimension[r.dimension]) {
      byDimension[r.dimension] = [];
    }
    const q = qMap[r.question_id] || {};
    byDimension[r.dimension].push({
      question: q.text?.substring(0, 60) + '...',
      response: r.response,
      type: q.type || r.question_type,
      reverse_scored: q.reverse_scored,
      weight: q.weight || 1.0
    });
  });
  
  console.log('=== RESPONSES BY DIMENSION ===\n');
  for (const [dim, resps] of Object.entries(byDimension)) {
    console.log(`\n📊 ${dim.toUpperCase()} (${resps.length} questions)`);
    console.log('-'.repeat(50));
    resps.forEach((r, i) => {
      const respVal = typeof r.response === 'object' ? JSON.stringify(r.response) : r.response;
      const flags = [];
      if (r.reverse_scored) flags.push('REVERSE');
      if (r.weight !== 1.0) flags.push(`weight:${r.weight}`);
      const flagStr = flags.length ? ` [${flags.join(', ')}]` : '';
      console.log(`  ${i+1}. Response: ${respVal}${flagStr}`);
      console.log(`     Q: "${r.question}"`);
    });
  }
  
  // 4. Get calculated results
  console.log('\n\n=== STORED RESULTS ===\n');
  const { data: results, error: resultsError } = await supabase
    .from('assessment_results')
    .select('*')
    .eq('session_id', latestSession.id)
    .single();
    
  if (resultsError) {
    console.error('Results error:', resultsError.message);
    return;
  }
  
  console.log('Results created:', results.created_at);
  console.log('\n📈 DIMENSIONAL SCORES:');
  console.log('-'.repeat(60));
  
  const scores = results.dimensional_scores || [];
  scores.sort((a, b) => b.percentile - a.percentile);
  
  scores.forEach((s, i) => {
    const bar = '█'.repeat(Math.round(s.percentile / 5));
    const suffix = getOrdinalSuffix(Math.round(s.percentile));
    console.log(`  ${i+1}. ${s.dimension.padEnd(20)} ${bar.padEnd(20)} ${Math.round(s.percentile)}${suffix} percentile`);
    console.log(`     Raw: ${s.raw_score?.toFixed(1)} | CI: ${s.confidence_interval?.[0]?.toFixed(1)}-${s.confidence_interval?.[1]?.toFixed(1)}`);
  });
  
  // 5. Show top 3 (what the ShareableCard displays)
  console.log('\n\n=== TOP 3 (ShareableCard Display) ===');
  const top3 = scores.slice(0, 3);
  top3.forEach((s, i) => {
    const suffix = getOrdinalSuffix(Math.round(s.percentile));
    console.log(`  ${s.dimension}: ${Math.round(s.percentile)}${suffix} percentile`);
  });
  
  // 6. Framework mappings
  if (results.framework_mappings) {
    console.log('\n\n=== FRAMEWORK MAPPINGS ===');
    const fw = results.framework_mappings;
    if (fw.mbti) {
      console.log(`\nMBTI: ${fw.mbti.type} (${fw.mbti.confidence}% confidence)`);
    }
    if (fw.enneagram) {
      console.log(`Enneagram: Type ${fw.enneagram.primary_type} w${fw.enneagram.wing}`);
    }
  }
  
  console.log('\n========================================');
  console.log('  Verification complete!');
  console.log('========================================\n');
}

function getOrdinalSuffix(n) {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
}

verifyResults().catch(console.error);

