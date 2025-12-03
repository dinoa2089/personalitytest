#!/usr/bin/env node
/**
 * Run database migration directly against Supabase PostgreSQL
 */

const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const client = new Client({
  host: 'db.eqkcmlxxuubibzoqliee.supabase.co',
  port: 5432,
  database: 'postgres',
  user: 'postgres',
  password: '***REMOVED***',
  ssl: { rejectUnauthorized: false }
});

async function runMigration() {
  try {
    await client.connect();
    console.log('✓ Connected to Supabase PostgreSQL\n');
    
    const sqlPath = path.join(__dirname, '../../supabase/migrations/007_psychometric_enhancements.sql');
    const sql = fs.readFileSync(sqlPath, 'utf-8');
    
    // Split into statements, handling multi-line statements
    const statements = [];
    let current = '';
    
    for (const line of sql.split('\n')) {
      const trimmed = line.trim();
      
      // Skip pure comment lines
      if (trimmed.startsWith('--')) continue;
      
      current += line + '\n';
      
      // If line ends with semicolon, it's end of statement
      if (trimmed.endsWith(';')) {
        const stmt = current.trim();
        if (stmt.length > 1) {
          statements.push(stmt.slice(0, -1)); // Remove trailing semicolon
        }
        current = '';
      }
    }
    
    console.log(`Running ${statements.length} SQL statements...\n`);
    
    let success = 0;
    let skipped = 0;
    let errors = 0;
    
    for (let i = 0; i < statements.length; i++) {
      const stmt = statements[i];
      const firstLine = stmt.split('\n')[0].substring(0, 60);
      
      try {
        await client.query(stmt);
        console.log(`✓ [${i+1}/${statements.length}] ${firstLine}...`);
        success++;
      } catch (err) {
        const msg = err.message || '';
        if (msg.includes('already exists') || msg.includes('duplicate')) {
          console.log(`○ [${i+1}/${statements.length}] Already exists - skipped`);
          skipped++;
        } else {
          console.log(`✗ [${i+1}/${statements.length}] Error: ${msg.substring(0, 100)}`);
          errors++;
        }
      }
    }
    
    console.log('\n================================');
    console.log('MIGRATION COMPLETE');
    console.log('================================');
    console.log(`Successful: ${success}`);
    console.log(`Skipped (already exists): ${skipped}`);
    console.log(`Errors: ${errors}`);
    
    // Verify columns
    const { rows } = await client.query(
      "SELECT column_name FROM information_schema.columns WHERE table_name = 'questions' ORDER BY ordinal_position"
    );
    console.log('\n📋 Questions table columns:');
    console.log('   ' + rows.map(r => r.column_name).join(', '));
    
    // Count by is_core
    const { rows: coreCount } = await client.query(
      "SELECT is_core, COUNT(*) as count FROM questions GROUP BY is_core"
    );
    console.log('\n📊 Questions by is_core status:');
    coreCount.forEach(r => {
      console.log(`   ${r.is_core ? 'Core' : 'Supplementary'}: ${r.count}`);
    });
    
  } catch (err) {
    console.error('Migration failed:', err.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

runMigration();


