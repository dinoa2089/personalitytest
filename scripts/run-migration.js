#!/usr/bin/env node
/**
 * Run a SQL migration against Supabase
 * 
 * Usage:
 *   node scripts/run-migration.js [migration-file]
 * 
 * Example:
 *   node scripts/run-migration.js ../supabase/migrations/013_credit_system.sql
 * 
 * Requires:
 *   - NEXT_PUBLIC_SUPABASE_URL in .env.local
 *   - SUPABASE_SERVICE_ROLE_KEY in .env.local (not the anon key!)
 */

const fs = require('fs');
const path = require('path');

// Load environment variables from .env.local
function loadEnv() {
  const envPath = path.join(__dirname, '..', '.env.local');
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf-8');
    content.split('\n').forEach(line => {
      const match = line.match(/^([^=]+)=(.*)$/);
      if (match) {
        const key = match[1].trim();
        let value = match[2].trim();
        // Remove quotes
        if ((value.startsWith('"') && value.endsWith('"')) ||
            (value.startsWith("'") && value.endsWith("'"))) {
          value = value.slice(1, -1);
        }
        process.env[key] = value;
      }
    });
  }
}

async function runMigration(migrationPath) {
  loadEnv();
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || supabaseUrl.includes('your-project-id')) {
    console.error('❌ NEXT_PUBLIC_SUPABASE_URL not configured in .env.local');
    console.log('\nTo run migrations:');
    console.log('1. Go to your Supabase dashboard');
    console.log('2. Copy the SQL from the migration file');
    console.log('3. Run it in the SQL Editor');
    process.exit(1);
  }
  
  if (!serviceRoleKey || serviceRoleKey.includes('your-')) {
    console.error('❌ SUPABASE_SERVICE_ROLE_KEY not configured in .env.local');
    console.log('\nTo get your service role key:');
    console.log('1. Go to Supabase Dashboard > Settings > API');
    console.log('2. Copy the "service_role" key (secret, not anon)');
    console.log('3. Add SUPABASE_SERVICE_ROLE_KEY="your-key" to .env.local');
    console.log('\nAlternatively, copy the migration SQL and run it in the Supabase SQL Editor.');
    process.exit(1);
  }
  
  // Read migration file
  const fullPath = path.resolve(__dirname, '..', migrationPath);
  if (!fs.existsSync(fullPath)) {
    console.error(`❌ Migration file not found: ${fullPath}`);
    process.exit(1);
  }
  
  const sql = fs.readFileSync(fullPath, 'utf-8');
  console.log(`📄 Running migration: ${path.basename(fullPath)}`);
  console.log(`📊 SQL length: ${sql.length} characters`);
  
  // Execute via Supabase REST API
  const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
    method: 'POST',
    headers: {
      'apikey': serviceRoleKey,
      'Authorization': `Bearer ${serviceRoleKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ sql }),
  });
  
  if (!response.ok) {
    // Try alternative: direct SQL execution
    const pgResponse = await fetch(`${supabaseUrl}/pg`, {
      method: 'POST',
      headers: {
        'apikey': serviceRoleKey,
        'Authorization': `Bearer ${serviceRoleKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: sql }),
    });
    
    if (!pgResponse.ok) {
      console.error('❌ Failed to execute migration via API');
      console.log('\n📋 Please run this migration manually:');
      console.log('1. Go to Supabase Dashboard > SQL Editor');
      console.log(`2. Open file: ${fullPath}`);
      console.log('3. Copy the entire contents and run it');
      process.exit(1);
    }
    
    const result = await pgResponse.json();
    console.log('✅ Migration completed successfully!');
    return result;
  }
  
  const result = await response.json();
  console.log('✅ Migration completed successfully!');
  return result;
}

// Main
const migrationArg = process.argv[2] || '../supabase/migrations/013_credit_system.sql';
runMigration(migrationArg).catch(err => {
  console.error('Migration error:', err);
  process.exit(1);
});
