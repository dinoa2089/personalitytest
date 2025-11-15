/**
 * Check if Supabase is properly set up
 * Run with: node scripts/check-supabase-setup.js
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ ERROR: Supabase credentials not found in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSetup() {
  console.log('🔍 Checking Supabase setup...\n');

  // Check if questions table exists
  const { data, error } = await supabase
    .from('questions')
    .select('count', { count: 'exact', head: true });

  if (error) {
    if (error.message.includes('relation') || error.message.includes('does not exist')) {
      console.log('❌ The "questions" table does not exist yet.\n');
      console.log('📋 NEXT STEP: Run the database migration first!\n');
      console.log('1. Go to: https://supabase.com/dashboard');
      console.log('2. Select your project');
      console.log('3. Click "SQL Editor" → "New Query"');
      console.log('4. Copy ALL contents from: supabase/migrations/001_initial_schema.sql');
      console.log('5. Paste and click "Run"\n');
      console.log('After running the migration, run this script again.');
      process.exit(1);
    } else {
      console.error('❌ Error:', error.message);
      process.exit(1);
    }
  }

  // Table exists, check question count
  const { count } = await supabase
    .from('questions')
    .select('*', { count: 'exact', head: true });

  console.log(`✓ Questions table exists`);
  console.log(`✓ Found ${count} questions in database\n`);

  if (count === 0) {
    console.log('📋 NEXT STEP: Seed the questions!\n');
    console.log('Run: node scripts/seed-supabase-questions.js\n');
  } else {
    console.log('✅ Setup complete! Your database is ready.\n');
    console.log('You can now run: npm run dev');
  }
}

checkSetup().catch(console.error);

