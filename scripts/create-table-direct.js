/**
 * Create table via direct PostgreSQL connection
 * Requires: service_role key and pg library
 */

require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ ERROR: Service role key required for table creation');
  console.log('\n📋 To get your service_role key:');
  console.log('   1. Go to: https://supabase.com/dashboard');
  console.log('   2. Select your project');
  console.log('   3. Go to: Project Settings → API');
  console.log('   4. Copy the "service_role" key (NOT the anon key)');
  console.log('   5. Add to .env.local: SUPABASE_SERVICE_ROLE_KEY=your-service-role-key\n');
  process.exit(1);
}

// Extract database connection info from Supabase URL
// Supabase URL format: https://[project-ref].supabase.co
// We need to construct a PostgreSQL connection string
const projectRef = supabaseUrl.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1];
if (!projectRef) {
  console.error('❌ Could not parse Supabase URL');
  process.exit(1);
}

// Supabase connection string format
// postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres
// But we don't have the database password - only the service_role key

console.log('⚠️  Direct PostgreSQL connection requires the database password.');
console.log('   The service_role key alone is not enough for a direct connection.\n');

console.log('💡 RECOMMENDED SOLUTION: Use Supabase SQL Editor\n');
console.log('   1. Go to: https://supabase.com/dashboard');
console.log('   2. Select your project');
console.log('   3. Click "SQL Editor" → "New Query"');
console.log('   4. Open: supabase/complete-setup.sql');
console.log('   5. Copy ALL contents and paste into SQL Editor');
console.log('   6. Click "Run"\n');

console.log('This is the fastest and most reliable method!');

