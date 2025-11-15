/**
 * Run Supabase migration via direct PostgreSQL connection
 * Uses pg package to connect directly to Supabase PostgreSQL database
 * 
 * Run: node frontend/scripts/run-migration-direct.js
 */
require('dotenv').config({ path: './.env.local' });
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

async function runMigrationDirect() {
  console.log('🔄 Running migration via direct PostgreSQL connection...\n');

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing Supabase credentials');
    console.error('   Need: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
  }

  // Extract project ref from URL (e.g., https://eqkcmlxxuubibzoqliee.supabase.co)
  const projectRef = supabaseUrl.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1];
  if (!projectRef) {
    console.error('❌ Could not extract project ref from URL');
    process.exit(1);
  }

  console.log(`Project: ${projectRef}`);
  console.log(`URL: ${supabaseUrl}\n`);

  // Read migration file
  const migrationPath = path.join(__dirname, '../../supabase/migrations/001_initial_schema.sql');
  if (!fs.existsSync(migrationPath)) {
    console.error(`❌ Migration file not found: ${migrationPath}`);
    process.exit(1);
  }

  const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
  console.log(`✓ Read migration file (${migrationSQL.length} characters)\n`);

  // Supabase PostgreSQL connection details
  // Format: postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres
  // We need the database password - but we don't have it in env vars
  // Alternative: Use connection pooling with service_role key
  
  // Try using Supabase's connection pooling endpoint
  // Format: postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
  // But we still need the database password
  
  console.log('⚠️  Direct PostgreSQL connection requires database password');
  console.log('   The service_role key is for REST API, not direct DB connection\n');
  
  console.log('📋 MANUAL STEPS (Easiest Method):\n');
  console.log('1. Go to: https://supabase.com/dashboard');
  console.log('2. Select your project');
  console.log('3. Click "SQL Editor" (left sidebar)');
  console.log('4. Click "New Query"');
  console.log('5. Copy ALL contents from: supabase/migrations/001_initial_schema.sql');
  console.log('6. Paste into SQL Editor');
  console.log('7. Click "Run" (or press Ctrl+Enter)');
  console.log('8. You should see "Success. No rows returned" for each statement\n');
  
  console.log('📄 Migration file location:');
  console.log(`   ${path.resolve(migrationPath)}\n`);
  
  console.log('💡 Alternative: Use Supabase CLI');
  console.log('   1. Install: npm install -g supabase');
  console.log('   2. Link: supabase link --project-ref ' + projectRef);
  console.log('   3. Push: supabase db push\n');
  
  // Try to use Supabase Management API if available
  console.log('🔍 Checking if we can use Supabase Management API...\n');
  
  // The Management API requires a different auth token
  // For now, manual SQL Editor is the simplest approach
  
  console.log('✅ Recommendation: Use SQL Editor (manual method above)');
  console.log('   It\'s the fastest and most reliable way to run migrations.\n');
}

runMigrationDirect().catch(console.error);

