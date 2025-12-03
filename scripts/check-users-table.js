const { Client } = require('pg');
const client = new Client({
  host: 'db.eqkcmlxxuubibzoqliee.supabase.co',
  port: 5432,
  database: 'postgres',
  user: 'postgres',
  password: '***REMOVED***',
  ssl: { rejectUnauthorized: false }
});

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

