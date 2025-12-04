require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ ERROR: Supabase credentials not found in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTables() {
  console.log('🔍 Checking all tables...\n');

  const tables = [
    'business_accounts',
    'job_postings',
    'applicant_assessments',
    'business_team_members',
    'referral_codes',
    'referrals',
    'premium_unlocks',
  ];

  for (const table of tables) {
    try {
      // Try to query the table with a simple select
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(0);
      
      if (error) {
        if (error.message.includes('relation') || error.message.includes('does not exist')) {
          console.log(`❌ ${table} - TABLE DOES NOT EXIST`);
        } else if (error.message.includes('permission') || error.message.includes('RLS')) {
          console.log(`⚠️  ${table} - EXISTS but RLS blocked (this is OK - table exists)`);
        } else {
          console.log(`❌ ${table} - ERROR: ${error.message}`);
        }
      } else {
        console.log(`✓ ${table} - EXISTS and accessible`);
      }
    } catch (err) {
      console.log(`❌ ${table} - ERROR: ${err.message}`);
    }
  }

  console.log('\n');
  console.log('Note: If tables show RLS blocked, they exist but need RLS policies.');
  console.log('This is normal - the migration should have created them.\n');
}

checkTables().catch(console.error);






