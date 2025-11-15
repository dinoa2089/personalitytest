/**
 * Attempt to create the questions table via Supabase API
 * Note: This typically requires the service_role key, not the anon key
 */

require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Optional - for admin operations

// Try with service_role key if available, otherwise use anon key
const apiKey = supabaseServiceKey || supabaseAnonKey;

if (!supabaseUrl || !apiKey) {
  console.error('❌ ERROR: Supabase credentials not found');
  if (!supabaseServiceKey) {
    console.log('\n⚠️  Note: Creating tables typically requires the service_role key.');
    console.log('   Get it from: Supabase Dashboard → Project Settings → API → service_role key');
    console.log('   Add it to .env.local as: SUPABASE_SERVICE_ROLE_KEY=your-service-role-key');
  }
  process.exit(1);
}

// SQL to create the table
const createTableSQL = `
CREATE TABLE IF NOT EXISTS questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  text TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('likert', 'forced_choice', 'situational_judgment', 'behavioral_frequency')),
  dimension TEXT NOT NULL CHECK (dimension IN ('openness', 'conscientiousness', 'extraversion', 'agreeableness', 'emotionalResilience', 'honestyHumility', 'adaptability')),
  options JSONB,
  reverse_scored BOOLEAN DEFAULT FALSE,
  weight NUMERIC DEFAULT 1.0,
  order_index INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_questions_dimension ON questions(dimension);
CREATE INDEX IF NOT EXISTS idx_questions_type ON questions(type);
CREATE INDEX IF NOT EXISTS idx_questions_order ON questions(order_index);
`;

async function createTable() {
  console.log('🔨 Attempting to create table via Supabase API...\n');

  // Method 1: Try Supabase REST API with rpc (if a function exists)
  // This won't work for DDL, but let's try the database API endpoint
  
  // Method 2: Try direct PostgreSQL connection via Supabase's database API
  // Supabase doesn't expose DDL via REST API for security reasons
  
  // Method 3: Use Supabase Management API (requires service_role key)
  try {
    // Try using Supabase's database API endpoint
    // Note: This endpoint may not exist or may require service_role key
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': apiKey,
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ sql: createTableSQL }),
    });

    if (response.ok) {
      console.log('✅ Table created successfully!');
      return true;
    } else {
      const errorText = await response.text();
      console.log('❌ API method failed:', response.status, errorText);
    }
  } catch (error) {
    console.log('❌ API call failed:', error.message);
  }

  // If API method doesn't work, try alternative approach
  console.log('\n⚠️  Direct API table creation is not supported by Supabase.');
  console.log('   Supabase REST API is designed for CRUD operations, not DDL.\n');
  
  console.log('📋 You have two options:\n');
  console.log('OPTION 1: Run SQL in Supabase Dashboard (Recommended)');
  console.log('   1. Go to: https://supabase.com/dashboard');
  console.log('   2. Select your project');
  console.log('   3. Click "SQL Editor" → "New Query"');
  console.log('   4. Copy contents from: supabase/complete-setup.sql');
  console.log('   5. Paste and click "Run"\n');
  
  console.log('OPTION 2: Use Supabase CLI (if installed)');
  console.log('   supabase db push supabase/migrations/001_initial_schema.sql\n');
  
  return false;
}

createTable().then(success => {
  if (success) {
    console.log('\n✅ Success! You can now seed questions.');
  } else {
    console.log('\n💡 The SQL script approach (Option 1) is the most reliable method.');
  }
}).catch(console.error);

