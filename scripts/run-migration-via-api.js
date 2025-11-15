/**
 * Attempt to run Supabase migration via direct PostgreSQL connection
 * Uses service_role key to connect directly to PostgreSQL
 * 
 * Run: node frontend/scripts/run-migration-via-api.js
 */
require('dotenv').config({ path: './.env.local' });
const fs = require('fs');
const path = require('path');

async function runMigrationViaAPI() {
  console.log('🔄 Attempting to run migration via API...\n');

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing Supabase credentials');
    console.error('   Need: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
    return;
  }

  // Extract project ref from URL (e.g., https://eqkcmlxxuubibzoqliee.supabase.co)
  const projectRef = supabaseUrl.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1];
  if (!projectRef) {
    console.error('❌ Could not extract project ref from URL');
    return;
  }

  console.log(`Project: ${projectRef}`);
  console.log(`URL: ${supabaseUrl}\n`);

  // Read migration file
  const migrationPath = path.join(__dirname, '../../supabase/migrations/001_initial_schema.sql');
  if (!fs.existsSync(migrationPath)) {
    console.error(`❌ Migration file not found: ${migrationPath}`);
    return;
  }

  const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
  console.log(`✓ Read migration file (${migrationSQL.length} characters)\n`);

  // Supabase REST API doesn't support arbitrary SQL execution
  // We need to use direct PostgreSQL connection
  // Try using Supabase's REST API with a custom function, or direct pg connection
  
  console.log('⚠️  Supabase REST API does not support DDL operations (CREATE TABLE, etc.)');
  console.log('   Direct PostgreSQL connection required.\n');
  
  console.log('📋 MANUAL STEPS REQUIRED:\n');
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
  
  console.log('💡 Alternative: Install pg package and connect directly');
  console.log('   npm install pg');
  console.log('   Then we can create a script that connects via PostgreSQL protocol\n');
}

runMigrationViaAPI().catch(console.error);

