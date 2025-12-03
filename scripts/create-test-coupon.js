#!/usr/bin/env node
/**
 * Create a 100% off Stripe coupon for testing
 */

require('dotenv').config({ path: '.env.local' });
const Stripe = require('stripe');

const stripeKey = process.env.STRIPE_SECRET_KEY;

if (!stripeKey) {
  console.error('❌ STRIPE_SECRET_KEY not found in .env.local');
  process.exit(1);
}

const stripe = new Stripe(stripeKey);

async function createCoupon() {
  try {
    console.log('🎟️  Creating 100% off coupon...\n');

    let coupon;
    
    // Try to get existing coupon first
    try {
      coupon = await stripe.coupons.retrieve('107TYPES');
      console.log('📋 Coupon "107TYPES" already exists!\n');
    } catch (e) {
      // Create new coupon if it doesn't exist
      coupon = await stripe.coupons.create({
        id: '107TYPES',
        name: '107 Types - 100% Off',
        percent_off: 100,
        duration: 'forever',
        max_redemptions: 100,
        metadata: {
          purpose: 'testing',
          created_by: 'script',
        },
      });
      console.log('✅ Coupon created successfully!\n');
    }

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📋 Coupon Details:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`   ID:            ${coupon.id}`);
    console.log(`   Name:          ${coupon.name}`);
    console.log(`   Discount:      ${coupon.percent_off}% off`);
    console.log(`   Duration:      ${coupon.duration}`);
    console.log(`   Max Uses:      ${coupon.max_redemptions || 'unlimited'}`);
    console.log(`   Times Used:    ${coupon.times_redeemed}`);
    console.log(`   Valid:         ${coupon.valid ? 'Yes' : 'No'}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // Create a promotion code that users can enter at checkout
    let promoCode;
    
    // Check for existing promo code
    const existingPromos = await stripe.promotionCodes.list({
      code: '107TYPES',
      limit: 1,
    });

    if (existingPromos.data.length > 0) {
      promoCode = existingPromos.data[0];
      console.log('🏷️  Promotion code already exists!\n');
    } else {
      promoCode = await stripe.promotionCodes.create({
        coupon: '107TYPES',
        code: '107TYPES',
        max_redemptions: 100,
        metadata: {
          purpose: 'testing',
        },
      });
      console.log('🏷️  Promotion Code created!\n');
    }

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🎉 SHARE THIS CODE WITH TESTERS:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('');
    console.log('   ╔═══════════════════════════╗');
    console.log('   ║        107TYPES           ║');
    console.log('   ╚═══════════════════════════╝');
    console.log('');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('💡 Users enter "107TYPES" at Stripe checkout to get 100% off!');
    console.log('');

  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.raw) {
      console.error('   Details:', error.raw.message);
    }
  }
}

createCoupon();
