/**
 * Test script to verify Supabase connection
 * Run with: node scripts/test-supabase-connection.js
 */

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('🔍 Testing Supabase Connection...\n');

// Check if environment variables are set
if (!supabaseUrl || !supabaseKey) {
  console.error('❌ ERROR: Environment variables not found!');
  console.log('\nPlease make sure .env.local exists with:');
  console.log('  NEXT_PUBLIC_SUPABASE_URL=...');
  console.log('  NEXT_PUBLIC_SUPABASE_ANON_KEY=...');
  process.exit(1);
}

console.log('✓ Environment variables found');
console.log(`  URL: ${supabaseUrl}`);
console.log(`  Key: ${supabaseKey.substring(0, 20)}...\n`);

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

// Test 1: Check if we can connect to Supabase
console.log('Test 1: Testing Supabase connection...');
supabase
  .from('questions')
  .select('count', { count: 'exact', head: true })
  .then(({ count, error }) => {
    if (error) {
      console.error('❌ Connection failed:', error.message);
      console.error('   Error details:', error);
      
      if (error.message.includes('relation') || error.message.includes('does not exist')) {
        console.log('\n⚠️  The "questions" table does not exist.');
        console.log('   Please run the database migration: supabase/migrations/001_initial_schema.sql');
      } else if (error.message.includes('JWT') || error.message.includes('token')) {
        console.log('\n⚠️  Authentication failed. Check your API key.');
      } else if (error.message.includes('network') || error.message.includes('fetch')) {
        console.log('\n⚠️  Network error. Check your internet connection and Supabase URL.');
      }
      process.exit(1);
    } else {
      console.log(`✓ Connection successful!`);
      console.log(`  Found ${count} questions in database\n`);
      
      // Test 2: Try to fetch a few questions
      console.log('Test 2: Fetching sample questions...');
      return supabase
        .from('questions')
        .select('id, text, type, dimension')
        .limit(5)
        .order('order_index', { ascending: true });
    }
  })
  .then((result) => {
    if (result && result.data) {
      if (result.error) {
        console.error('❌ Error fetching questions:', result.error.message);
        process.exit(1);
      } else {
        console.log(`✓ Successfully fetched ${result.data.length} questions:\n`);
        result.data.forEach((q, i) => {
          console.log(`  ${i + 1}. [${q.dimension}] ${q.text.substring(0, 50)}...`);
        });
        console.log('\n✅ All tests passed! Supabase is configured correctly.');
        console.log('\nYou can now run: npm run dev');
        console.log('The app will load questions from Supabase.');
      }
    }
  })
  .catch((error) => {
    console.error('❌ Unexpected error:', error.message);
    process.exit(1);
  });

