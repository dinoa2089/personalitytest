#!/usr/bin/env node
require('dotenv').config({ path: '.env.local' });

const stripeKey = process.env.STRIPE_SECRET_KEY;

async function main() {
  console.log('Creating "107types" coupon (lowercase)...\n');

  // Create the coupon with lowercase ID
  const createRes = await fetch('https://api.stripe.com/v1/coupons', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${stripeKey}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      'id': '107types',
      'name': '107 Types - 100% Off (Testing)',
      'percent_off': '100',
      'duration': 'forever',
      'max_redemptions': '100',
    }),
  });
  
  const coupon = await createRes.json();
  
  if (coupon.error) {
    if (coupon.error.code === 'resource_already_exists') {
      console.log('✅ Coupon "107types" already exists!\n');
    } else {
      console.log('Error creating coupon:', coupon.error.message);
      return;
    }
  } else {
    console.log('✅ Coupon created!\n');
  }

  // Get coupon details
  const getRes = await fetch('https://api.stripe.com/v1/coupons/107types', {
    headers: { 'Authorization': `Bearer ${stripeKey}` },
  });
  const details = await getRes.json();
  
  console.log('📋 Coupon Details:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('   ID:           ', details.id);
  console.log('   Name:         ', details.name);
  console.log('   Discount:     ', details.percent_off + '% off');
  console.log('   Valid:        ', details.valid ? 'Yes' : 'No');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🎉 SHARE THIS CODE WITH TESTERS:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('');
  console.log('   ╔═══════════════════════════╗');
  console.log('   ║        107types           ║');
  console.log('   ╚═══════════════════════════╝');
  console.log('');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  console.log('📌 Now create the promotion code in Stripe Dashboard:');
  console.log('   1. Go to: https://dashboard.stripe.com/coupons/107types');
  console.log('   2. Click "+ New" under Promotion codes');
  console.log('   3. Enter "107types" as the code');
  console.log('   4. Save\n');
}

main().catch(console.error);


