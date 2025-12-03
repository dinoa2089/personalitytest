#!/usr/bin/env node
require('dotenv').config({ path: '.env.local' });

const stripeKey = process.env.STRIPE_SECRET_KEY;

async function main() {
  console.log('Creating promotion code for 107TYPES coupon...\n');

  // Use fetch to directly call Stripe API
  const response = await fetch('https://api.stripe.com/v1/promotion_codes', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${stripeKey}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      'coupon': '107TYPES',
      'code': '107TYPES',
    }),
  });

  const result = await response.json();

  if (result.error) {
    if (result.error.code === 'resource_already_exists') {
      console.log('✅ Promotion code "107TYPES" already exists!\n');
    } else {
      console.log('Error:', result.error.message);
    }
  } else {
    console.log('✅ Promotion code created!\n');
    console.log('   Code:', result.code);
    console.log('   ID:', result.id);
  }

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🎉 SHARE THIS CODE WITH TESTERS:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('');
  console.log('   ╔═══════════════════════════╗');
  console.log('   ║        107TYPES           ║');
  console.log('   ╚═══════════════════════════╝');
  console.log('');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('');
  console.log('💡 At checkout, testers enter "107TYPES" to get 100% off!');
  console.log('');
}

main().catch(console.error);
