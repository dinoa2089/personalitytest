#!/usr/bin/env node
require('dotenv').config({ path: '.env.local' });

const stripeKey = process.env.STRIPE_SECRET_KEY;

async function main() {
  console.log('Checking Stripe coupon status...\n');

  // Get coupon details
  const couponRes = await fetch('https://api.stripe.com/v1/coupons/107TYPES', {
    headers: { 'Authorization': `Bearer ${stripeKey}` },
  });
  const coupon = await couponRes.json();
  
  console.log('📋 Coupon Details:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('   ID:           ', coupon.id);
  console.log('   Name:         ', coupon.name);
  console.log('   Discount:     ', coupon.percent_off + '% off');
  console.log('   Valid:        ', coupon.valid ? 'Yes' : 'No');
  console.log('   Times Used:   ', coupon.times_redeemed);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  // List existing promotion codes
  const promoRes = await fetch('https://api.stripe.com/v1/promotion_codes?limit=10', {
    headers: { 'Authorization': `Bearer ${stripeKey}` },
  });
  const promos = await promoRes.json();
  
  console.log('🏷️  Existing Promotion Codes:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  if (promos.data && promos.data.length > 0) {
    promos.data.forEach(p => {
      console.log(`   ${p.code} → coupon: ${p.coupon?.id || p.coupon}, active: ${p.active}`);
    });
  } else {
    console.log('   (none found)');
  }
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  // The actual fix: Create promotion code that links to the coupon
  console.log('Attempting to create promotion code...');
  
  // First check if 107TYPES promo code exists
  const existingPromoRes = await fetch('https://api.stripe.com/v1/promotion_codes?code=107TYPES', {
    headers: { 'Authorization': `Bearer ${stripeKey}` },
  });
  const existingPromo = await existingPromoRes.json();
  
  if (existingPromo.data && existingPromo.data.length > 0) {
    console.log('\n✅ Promotion code "107TYPES" already exists!');
    const p = existingPromo.data[0];
    console.log('   ID:', p.id);
    console.log('   Active:', p.active);
    console.log('   Coupon:', p.coupon?.id || p.coupon);
  } else {
    // Create the promo code
    const createRes = await fetch('https://api.stripe.com/v1/promotion_codes', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${stripeKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'coupon=107TYPES&code=107TYPES',
    });
    const created = await createRes.json();
    
    if (created.error) {
      console.log('\n⚠️  Could not create promotion code:', created.error.message);
      console.log('\n📌 Create it manually in Stripe Dashboard:');
      console.log('   1. Go to: https://dashboard.stripe.com/coupons');
      console.log('   2. Click on the "107TYPES" coupon');
      console.log('   3. Click "+ New" under Promotion codes');
      console.log('   4. Enter "107TYPES" as the code');
      console.log('   5. Save');
    } else {
      console.log('\n✅ Promotion code created!');
      console.log('   Code:', created.code);
    }
  }

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🎉 TESTERS USE THIS CODE AT CHECKOUT:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('');
  console.log('   ╔═══════════════════════════╗');
  console.log('   ║        107TYPES           ║');
  console.log('   ╚═══════════════════════════╝');
  console.log('');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

main().catch(console.error);

