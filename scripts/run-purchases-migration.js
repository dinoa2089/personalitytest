#!/usr/bin/env node
/**
 * Run purchases table migration directly against Supabase PostgreSQL
 */

const { Client } = require('pg');

// Load from environment variable or .env file
require('dotenv').config({ path: '.env.local' });

if (!process.env.SUPABASE_DB_PASSWORD) {
  console.error('ERROR: SUPABASE_DB_PASSWORD environment variable not set');
  console.error('Set it in .env.local or export it before running this script');
  process.exit(1);
}

const client = new Client({
  host: process.env.SUPABASE_DB_HOST || 'db.eqkcmlxxuubibzoqliee.supabase.co',
  port: 5432,
  database: 'postgres',
  user: 'postgres',
  password: process.env.SUPABASE_DB_PASSWORD,
  ssl: { rejectUnauthorized: false }
});

// Each statement as a separate string to avoid splitting issues
const statements = [
  // Create table
  `CREATE TABLE IF NOT EXISTS purchases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    session_id UUID,
    product_type VARCHAR(50) NOT NULL,
    stripe_payment_intent_id VARCHAR(255),
    stripe_checkout_session_id VARCHAR(255),
    amount_paid DECIMAL(10,2),
    credits_applied DECIMAL(10,2) DEFAULT 0,
    status VARCHAR(20) DEFAULT 'completed',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
  )`,
  
  // Create indexes
  `CREATE INDEX IF NOT EXISTS idx_purchases_user_session ON purchases(user_id, session_id)`,
  `CREATE INDEX IF NOT EXISTS idx_purchases_user_product ON purchases(user_id, product_type)`,
  `CREATE INDEX IF NOT EXISTS idx_purchases_status ON purchases(status)`,
  `CREATE INDEX IF NOT EXISTS idx_purchases_stripe_checkout ON purchases(stripe_checkout_session_id)`,
  
  // Enable RLS
  `ALTER TABLE purchases ENABLE ROW LEVEL SECURITY`,
  
  // Drop existing policies if they exist, then create new ones
  `DROP POLICY IF EXISTS "Users can view own purchases" ON purchases`,
  `DROP POLICY IF EXISTS "Service role can manage purchases" ON purchases`,
  
  // Create policies
  `CREATE POLICY "Users can view own purchases" ON purchases
    FOR SELECT USING (
      user_id IN (
        SELECT id FROM users WHERE clerk_id = auth.uid()::text
      )
    )`,
  
  `CREATE POLICY "Service role can manage purchases" ON purchases
    FOR ALL USING (auth.role() = 'service_role')`,
  
  // Add comments
  `COMMENT ON TABLE purchases IS 'Tracks individual micro-transaction purchases per user per assessment session'`,
  `COMMENT ON COLUMN purchases.product_type IS 'Product types: compatibility, career, frameworks, growth_plan, full_unlock'`,
  `COMMENT ON COLUMN purchases.session_id IS 'Assessment session ID - NULL means purchase applies to all sessions'`,
];

async function runMigration() {
  try {
    console.log('🚀 Running purchases table migration...');
    console.log('   Connecting to Supabase PostgreSQL...\n');
    
    await client.connect();
    console.log('✓ Connected to database\n');
    
    console.log(`Running ${statements.length} SQL statements...\n`);
    
    let success = 0;
    let skipped = 0;
    let errors = 0;
    
    for (let i = 0; i < statements.length; i++) {
      const stmt = statements[i];
      const firstLine = stmt.trim().split('\n')[0].substring(0, 60);
      
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
    console.log(`✓ Successful: ${success}`);
    console.log(`○ Skipped (already exists): ${skipped}`);
    console.log(`✗ Errors: ${errors}`);
    
    // Verify table was created
    const { rows } = await client.query(
      "SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'purchases' ORDER BY ordinal_position"
    );
    
    if (rows.length > 0) {
      console.log('\n📋 Purchases table columns:');
      rows.forEach(r => {
        console.log(`   - ${r.column_name} (${r.data_type})`);
      });
      console.log('\n✅ Migration successful! Purchases table is ready.');
    } else {
      console.log('\n⚠️  Could not verify purchases table.');
    }
    
  } catch (err) {
    console.error('\n❌ Migration failed:', err.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

runMigration();
