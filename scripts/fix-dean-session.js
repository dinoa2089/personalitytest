const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://eqkcmlxxuubibzoqliee.supabase.co', 
  'sb_secret_tCzyDalDHDI-iQqxGXx6Nw_qyb5kJej'
);

async function fixDeanSession() {
  const sessionId = '71ff03af-fe2f-4057-ae40-6f8424838904';
  const userId = '1e241dc5-c49d-41ea-a752-f5bfb12d81d4'; // dean@beanstalkconsulting.co
  
  console.log('Linking session to user account...');
  
  // Update the session
  const { error: sessionError } = await supabase
    .from('assessment_sessions')
    .update({ user_id: userId })
    .eq('id', sessionId);
    
  if (sessionError) {
    console.error('Error updating session:', sessionError);
    return;
  }
  console.log('✓ Session updated');
  
  // Update the results
  const { error: resultsError } = await supabase
    .from('assessment_results')
    .update({ user_id: userId })
    .eq('session_id', sessionId);
    
  if (resultsError) {
    console.error('Error updating results:', resultsError);
    return;
  }
  console.log('✓ Results updated');
  
  // Verify the fix
  const { data: session } = await supabase
    .from('assessment_sessions')
    .select('id, user_id')
    .eq('id', sessionId)
    .single();
    
  const { data: results } = await supabase
    .from('assessment_results')
    .select('id, user_id, session_id')
    .eq('session_id', sessionId)
    .single();
    
  console.log('\n=== Verification ===');
  console.log('Session:', session);
  console.log('Results:', results);
  
  // Also check user's premium status
  const { data: purchases } = await supabase
    .from('purchases')
    .select('*')
    .eq('user_id', userId);
    
  console.log('\nPurchases:', purchases);
  
  // Check credit balance
  const { data: credits } = await supabase
    .from('credit_balances')
    .select('*')
    .eq('user_id', userId);
    
  console.log('Credits:', credits);
}

fixDeanSession().catch(console.error);

