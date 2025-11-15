require('dotenv').config({ path: require('path').join(__dirname, '../../frontend/.env.local') });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ ERROR: Supabase credentials not found in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkMonetizationMigration() {
  console.log('🔍 Checking monetization migration (002_business_and_referrals.sql)...\n');

  const checks = [
    { name: 'results_access_level column', table: 'assessment_results', column: 'results_access_level' },
    { name: 'metadata column', table: 'assessment_results', column: 'metadata' },
    { name: 'referral_codes table', table: 'referral_codes' },
    { name: 'referrals table', table: 'referrals' },
    { name: 'premium_unlocks table', table: 'premium_unlocks' },
    { name: 'business_accounts table', table: 'business_accounts' },
    { name: 'job_postings table', table: 'job_postings' },
    { name: 'applicant_assessments table', table: 'applicant_assessments' },
    { name: 'business_team_members table', table: 'business_team_members' },
  ];

  let allPassed = true;

  for (const check of checks) {
    try {
      if (check.column) {
        // Check for column existence by trying to select it
        const { error } = await supabase
          .from(check.table)
          .select(check.column)
          .limit(1);
        
        if (error && error.message.includes('column') && error.message.includes('does not exist')) {
          console.log(`❌ ${check.name} - MISSING`);
          allPassed = false;
        } else {
          console.log(`✓ ${check.name} - EXISTS`);
        }
      } else {
        // Check for table existence by trying to select from it
        const { error } = await supabase
          .from(check.table)
          .select('*')
          .limit(1);
        
        if (error && (error.message.includes('relation') || error.message.includes('does not exist'))) {
          console.log(`❌ ${check.name} - MISSING`);
          allPassed = false;
        } else {
          console.log(`✓ ${check.name} - EXISTS`);
        }
      }
    } catch (err) {
      console.log(`❌ ${check.name} - ERROR: ${err.message}`);
      allPassed = false;
    }
  }

  console.log('\n');

  if (allPassed) {
    console.log('✅ All monetization features are set up!\n');
    console.log('Your database is ready for deployment. 🚀\n');
  } else {
    console.log('❌ Some monetization features are missing.\n');
    console.log('📋 NEXT STEP: Run the migration!\n');
    console.log('1. Go to: https://supabase.com/dashboard');
    console.log('2. Select your project');
    console.log('3. Click "SQL Editor" → "New Query"');
    console.log('4. Copy ALL contents from: supabase/migrations/002_business_and_referrals.sql');
    console.log('5. Paste and click "Run"\n');
    process.exit(1);
  }
}

checkMonetizationMigration().catch(console.error);

