/**
 * Test webhook handler directly with mock Clerk payload
 * Run: node frontend/scripts/test-webhook-direct.js
 */
require('dotenv').config({ path: './.env.local' });
const { createClient } = require('@supabase/supabase-js');

async function testWebhookDirect() {
  console.log('🧪 Testing Webhook Direct Insert...\n');

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl) {
    console.error('❌ NEXT_PUBLIC_SUPABASE_URL not set');
    return;
  }

  if (!supabaseServiceKey) {
    console.error('❌ SUPABASE_SERVICE_ROLE_KEY not set');
    console.log('Using anon key instead (will likely fail due to RLS)...');
  }

  const supabaseKey = supabaseServiceKey || supabaseAnonKey;
  console.log(`Using key type: ${supabaseServiceKey ? 'SERVICE_ROLE ✅' : 'ANON ⚠️'}\n`);

  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  // Test insert with mock Clerk user data
  const testClerkId = `test_${Date.now()}`;
  const testEmail = `test_${Date.now()}@example.com`;

  console.log(`Attempting to insert test user:`);
  console.log(`  clerk_id: ${testClerkId}`);
  console.log(`  email: ${testEmail}\n`);

  const { data, error } = await supabase
    .from('users')
    .insert({
      clerk_id: testClerkId,
      email: testEmail,
    })
    .select();

  if (error) {
    console.error('❌ Insert failed:');
    console.error(`  Code: ${error.code}`);
    console.error(`  Message: ${error.message}`);
    console.error(`  Details: ${error.details}`);
    console.error(`  Hint: ${error.hint}`);
    
    if (error.code === '42501') {
      console.error('\n⚠️ RLS is blocking the insert!');
      console.error('   Service role key should bypass RLS.');
      console.error('   Check that SUPABASE_SERVICE_ROLE_KEY is correct.');
    }
    return;
  }

  console.log('✅ Insert successful!');
  console.log('User created:', data);

  // Clean up test user
  console.log('\nCleaning up test user...');
  await supabase.from('users').delete().eq('clerk_id', testClerkId);
  console.log('✅ Test user deleted');
}

testWebhookDirect().catch(console.error);

