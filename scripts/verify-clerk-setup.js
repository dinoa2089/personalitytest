/**
 * Verify Clerk setup is correct
 * Run with: node scripts/verify-clerk-setup.js
 */

require('dotenv').config({ path: '.env.local' });

console.log('🔍 Verifying Clerk Setup...\n');

const clerkPublishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
const clerkSecretKey = process.env.CLERK_SECRET_KEY;
const webhookSecret = process.env.WEBHOOK_SECRET;

let allGood = true;

// Check publishable key
if (!clerkPublishableKey || clerkPublishableKey === '') {
  console.log('❌ NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is missing');
  allGood = false;
} else if (!clerkPublishableKey.startsWith('pk_test_') && !clerkPublishableKey.startsWith('pk_live_')) {
  console.log('⚠️  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY format looks incorrect (should start with pk_test_ or pk_live_)');
  console.log(`   Current value: ${clerkPublishableKey.substring(0, 20)}...`);
} else {
  console.log('✅ NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is set');
  console.log(`   Key: ${clerkPublishableKey.substring(0, 20)}...`);
}

// Check secret key
if (!clerkSecretKey || clerkSecretKey === '') {
  console.log('❌ CLERK_SECRET_KEY is missing');
  allGood = false;
} else if (!clerkSecretKey.startsWith('sk_test_') && !clerkSecretKey.startsWith('sk_live_')) {
  console.log('⚠️  CLERK_SECRET_KEY format looks incorrect (should start with sk_test_ or sk_live_)');
  console.log(`   Current value: ${clerkSecretKey.substring(0, 20)}...`);
} else {
  console.log('✅ CLERK_SECRET_KEY is set');
  console.log(`   Key: ${clerkSecretKey.substring(0, 20)}...`);
}

// Check webhook secret (optional but recommended)
if (!webhookSecret || webhookSecret === '') {
  console.log('⚠️  WEBHOOK_SECRET is not set (required for user sync to Supabase)');
  console.log('   Get it from: Clerk Dashboard → Webhooks → Your Endpoint → Signing Secret');
} else if (!webhookSecret.startsWith('whsec_')) {
  console.log('⚠️  WEBHOOK_SECRET format looks incorrect (should start with whsec_)');
  console.log(`   Current value: ${webhookSecret.substring(0, 20)}...`);
} else {
  console.log('✅ WEBHOOK_SECRET is set');
}

console.log('\n' + '='.repeat(50));
if (allGood) {
  console.log('✅ Clerk keys are configured!');
  console.log('\n📋 Next Steps:');
  console.log('1. Restart your dev server: npm run dev');
  console.log('2. Set up webhook in Clerk Dashboard (see CLERK_SETUP_INSTRUCTIONS.md)');
  console.log('3. Test authentication at http://localhost:3000');
} else {
  console.log('❌ Some Clerk keys are missing. Please check your .env.local file.');
}
console.log('='.repeat(50));

