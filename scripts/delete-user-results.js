/**
 * Script to delete all assessment data for a specific user email
 * Usage: node scripts/delete-user-results.js
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const EMAIL_TO_DELETE = 'dean@beanstalkconsulting.co';

async function deleteUserResults() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing Supabase credentials');
    console.log('   NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✓ Set' : '✗ Missing');
    console.log('   SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? '✓ Set' : '✗ Missing');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  console.log(`\n🔍 Looking for user: ${EMAIL_TO_DELETE}\n`);

  // Find the user
  const { data: user, error: userError } = await supabase
    .from('users')
    .select('id, email, clerk_id')
    .eq('email', EMAIL_TO_DELETE)
    .single();

  if (userError || !user) {
    console.error('❌ User not found:', userError?.message || 'No user with that email');
    process.exit(1);
  }

  console.log(`✓ Found user: ${user.email} (ID: ${user.id})`);

  // Count existing data
  const { count: sessionCount } = await supabase
    .from('assessment_sessions')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id);

  const { count: resultCount } = await supabase
    .from('assessment_results')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id);

  console.log(`\n📊 Found data to delete:`);
  console.log(`   - ${sessionCount || 0} assessment sessions`);
  console.log(`   - ${resultCount || 0} assessment results`);

  if (!sessionCount && !resultCount) {
    console.log('\n✅ No assessment data found - you can take a fresh assessment!');
    process.exit(0);
  }

  console.log('\n🗑️  Deleting data...\n');

  // Delete in order (respecting foreign keys)

  // 1. Delete shared results (references assessment_results)
  const { error: sharedError, count: sharedCount } = await supabase
    .from('shared_results')
    .delete({ count: 'exact' })
    .in('result_id', 
      supabase.from('assessment_results').select('id').eq('user_id', user.id)
    );
  
  if (sharedError) {
    console.log('   ⚠️  Shared results:', sharedError.message);
  } else {
    console.log(`   ✓ Deleted shared results`);
  }

  // 2. Delete assessment results
  const { error: resultsError } = await supabase
    .from('assessment_results')
    .delete()
    .eq('user_id', user.id);
  
  if (resultsError) {
    console.log('   ❌ Assessment results:', resultsError.message);
  } else {
    console.log(`   ✓ Deleted ${resultCount} assessment results`);
  }

  // 3. Get session IDs first
  const { data: sessions } = await supabase
    .from('assessment_sessions')
    .select('id')
    .eq('user_id', user.id);

  const sessionIds = sessions?.map(s => s.id) || [];

  // 4. Delete assessment responses
  if (sessionIds.length > 0) {
    const { error: responsesError } = await supabase
      .from('assessment_responses')
      .delete()
      .in('session_id', sessionIds);
    
    if (responsesError) {
      console.log('   ⚠️  Assessment responses:', responsesError.message);
    } else {
      console.log(`   ✓ Deleted assessment responses`);
    }
  }

  // 5. Delete assessment sessions
  const { error: sessionsError } = await supabase
    .from('assessment_sessions')
    .delete()
    .eq('user_id', user.id);
  
  if (sessionsError) {
    console.log('   ❌ Assessment sessions:', sessionsError.message);
  } else {
    console.log(`   ✓ Deleted ${sessionCount} assessment sessions`);
  }

  // 6. Delete user achievements
  const { error: achievementsError } = await supabase
    .from('user_achievements')
    .delete()
    .eq('user_id', user.id);
  
  if (!achievementsError) {
    console.log(`   ✓ Deleted user achievements`);
  }

  // 7. Delete personality comparisons
  const { error: comparisonsError } = await supabase
    .from('personality_comparisons')
    .delete()
    .or(`user_id.eq.${user.id},compared_user_id.eq.${user.id}`);
  
  if (!comparisonsError) {
    console.log(`   ✓ Deleted personality comparisons`);
  }

  console.log('\n✅ All assessment data deleted for', EMAIL_TO_DELETE);
  console.log('   You can now retake the assessment!\n');
}

deleteUserResults().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});


