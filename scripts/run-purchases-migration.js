/**
 * Run the purchases table migration
 * Usage: node scripts/run-purchases-migration.js
 */
const { createClient } = require("@supabase/supabase-js");
require("dotenv").config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("❌ Missing Supabase credentials in .env.local");
  console.error("   Required: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

const migrationSQL = `
-- Migration: Create purchases table for micro-transactions
-- Track individual purchases per user per session

CREATE TABLE IF NOT EXISTS purchases (
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
);

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_purchases_user_session ON purchases(user_id, session_id);
CREATE INDEX IF NOT EXISTS idx_purchases_user_product ON purchases(user_id, product_type);
CREATE INDEX IF NOT EXISTS idx_purchases_status ON purchases(status);
CREATE INDEX IF NOT EXISTS idx_purchases_stripe_checkout ON purchases(stripe_checkout_session_id);
`;

async function runMigration() {
  console.log("🚀 Running purchases table migration...");
  console.log(`   Project: ${supabaseUrl}`);

  try {
    // Try to run the migration using rpc or direct query
    const { data, error } = await supabase.rpc("exec_sql", {
      sql: migrationSQL,
    });

    if (error) {
      // If exec_sql doesn't exist, try checking if table exists
      console.log("   Note: exec_sql not available, checking table directly...");
      
      // Check if purchases table already exists
      const { data: tableCheck, error: checkError } = await supabase
        .from("purchases")
        .select("id")
        .limit(1);

      if (!checkError) {
        console.log("✅ Purchases table already exists!");
        return;
      }

      // Table doesn't exist - user needs to run SQL manually
      console.log("\n⚠️  Cannot run SQL directly via API.");
      console.log("   Please run the following SQL in Supabase Dashboard:\n");
      console.log("   1. Go to: https://supabase.com/dashboard");
      console.log("   2. Select project: eqkcmlxxuubibzoqliee");
      console.log("   3. Go to SQL Editor");
      console.log("   4. Run the SQL from: supabase/migrations/009_purchases_table.sql");
      return;
    }

    console.log("✅ Migration completed successfully!");
  } catch (err) {
    console.error("Error:", err.message);
    
    // Check if purchases table exists despite the error
    try {
      const { error: checkError } = await supabase
        .from("purchases")
        .select("id")
        .limit(1);

      if (!checkError) {
        console.log("✅ Purchases table already exists!");
      } else {
        console.log("\n📋 Please run the migration manually in Supabase Dashboard:");
        console.log("   https://supabase.com/dashboard/project/eqkcmlxxuubibzoqliee/sql");
      }
    } catch (e) {
      console.log("\n📋 Please run the migration manually in Supabase Dashboard:");
      console.log("   https://supabase.com/dashboard/project/eqkcmlxxuubibzoqliee/sql");
    }
  }
}

runMigration();

