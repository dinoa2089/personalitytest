const { Client } = require('pg');

// Load from environment variable or .env file
require('dotenv').config({ path: '.env.local' });

const client = new Client({
  host: process.env.SUPABASE_DB_HOST,
  port: 5432,
  database: 'postgres',
  user: 'postgres',
  password: process.env.SUPABASE_DB_PASSWORD,
  ssl: { rejectUnauthorized: false }
});

if (!process.env.SUPABASE_DB_PASSWORD) {
  console.error('ERROR: SUPABASE_DB_PASSWORD environment variable not set');
  console.error('Set it in .env.local or export it before running this script');
  process.exit(1);
}

async function check() {
  await client.connect();
  
  // Check users table structure
  const { rows: cols } = await client.query(
    "SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'users' ORDER BY ordinal_position"
  );
  console.log('Users table columns:');
  cols.forEach(r => console.log('   - ' + r.column_name + ' (' + r.data_type + ')'));
  
  // Count users
  const { rows: count } = await client.query('SELECT COUNT(*) as total FROM users');
  console.log('\nTotal users synced:', count[0].total);
  
  // Show a sample user
  const { rows: sample } = await client.query('SELECT id, clerk_id, email, created_at FROM users LIMIT 3');
  if (sample.length > 0) {
    console.log('\nSample users:');
    sample.forEach(u => console.log('   - ' + (u.email || 'no email') + ' (clerk: ' + (u.clerk_id ? u.clerk_id.substring(0,20) + '...' : 'none') + ')'));
  }
  
  await client.end();
}
check().catch(e => console.error('Error:', e.message));

