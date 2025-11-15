/**
 * Sync existing Clerk users to Supabase users table
 * Fetches all users from Clerk and inserts them into Supabase
 * 
 * Run: node frontend/scripts/sync-clerk-users.js
 */
require('dotenv').config({ path: './.env.local' });
const { createClient } = require('@supabase/supabase-js');

async function syncClerkUsers() {
  console.log('🔄 Syncing Clerk users to Supabase...\n');

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const clerkSecretKey = process.env.CLERK_SECRET_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing Supabase credentials');
    console.error('   Need: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
  }

  if (!clerkSecretKey) {
    console.error('❌ Missing Clerk secret key');
    console.error('   Need: CLERK_SECRET_KEY in .env.local');
    process.exit(1);
  }

  // Create Supabase client with service_role key
  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  // Fetch users from Clerk API
  console.log('📥 Fetching users from Clerk...\n');
  
  try {
    // Clerk API endpoint for listing users
    const clerkApiUrl = 'https://api.clerk.com/v1/users';
    
    const response = await fetch(clerkApiUrl, {
      headers: {
        'Authorization': `Bearer ${clerkSecretKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Clerk API error:', response.status, errorText);
      process.exit(1);
    }

    const users = await response.json();
    console.log(`✓ Found ${users.length} user(s) in Clerk\n`);

    if (users.length === 0) {
      console.log('ℹ️  No users to sync');
      return;
    }

    // Sync each user to Supabase
    console.log('📤 Syncing users to Supabase...\n');
    
    let successCount = 0;
    let skipCount = 0;
    let errorCount = 0;

    for (const user of users) {
      const clerkId = user.id;
      const email = user.email_addresses?.[0]?.email_address || null;
      const firstName = user.first_name || null;
      const lastName = user.last_name || null;

      console.log(`Processing: ${email || clerkId}...`);

      // Check if user already exists
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('clerk_id', clerkId)
        .single();

      if (existingUser) {
        console.log(`  ⏭️  Already exists, updating...`);
        
        // Update existing user
        const { error: updateError } = await supabase
          .from('users')
          .update({
            email: email,
            updated_at: new Date().toISOString(),
            metadata: {
              first_name: firstName,
              last_name: lastName,
              ...(user.metadata || {}),
            },
          })
          .eq('clerk_id', clerkId);

        if (updateError) {
          console.error(`  ❌ Update failed:`, updateError.message);
          errorCount++;
        } else {
          console.log(`  ✅ Updated successfully`);
          successCount++;
        }
      } else {
        // Insert new user
        const { data: insertedData, error: insertError } = await supabase
          .from('users')
          .insert({
            clerk_id: clerkId,
            email: email,
            metadata: {
              first_name: firstName,
              last_name: lastName,
              ...(user.metadata || {}),
            },
          })
          .select();

        if (insertError) {
          console.error(`  ❌ Insert failed:`, insertError.message);
          errorCount++;
        } else {
          console.log(`  ✅ Inserted successfully`);
          successCount++;
        }
      }
    }

    console.log('\n📊 Summary:');
    console.log(`  ✅ Synced: ${successCount}`);
    console.log(`  ⏭️  Updated: ${skipCount}`);
    console.log(`  ❌ Errors: ${errorCount}`);
    console.log(`  📝 Total: ${users.length}\n`);

    if (errorCount === 0) {
      console.log('✅ All users synced successfully!\n');
    } else {
      console.log(`⚠️  ${errorCount} user(s) failed to sync\n`);
    }

  } catch (error) {
    console.error('❌ Error syncing users:', error);
    process.exit(1);
  }
}

syncClerkUsers().catch(console.error);

