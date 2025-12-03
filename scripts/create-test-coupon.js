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

    // Create the coupon
    const coupon = await stripe.coupons.create({
      id: '107TYPES',
      name: '107 Types - 100% Off',
      percent_off: 100,
      duration: 'forever',
      max_redemptions: 100, // Limit to 100 uses for safety
      metadata: {
        purpose: 'testing',
        created_by: 'script',
      },
    });

    console.log('✅ Coupon created successfully!\n');
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

    // Create a promotion code that users can enter
    const promoCode = await stripe.promotionCodes.create({
      coupon: coupon.id,
      code: '107TYPES',
      max_redemptions: 100,
      metadata: {
        purpose: 'testing',
      },
    });

    console.log('🏷️  Promotion Code created!\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📋 Share this code with testers:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`   Code:          ${promoCode.code}`);
    console.log(`   Promo ID:      ${promoCode.id}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    console.log('💡 Users can enter "107TYPES" at checkout to get 100% off!');

  } catch (error) {
    if (error.code === 'resource_already_exists') {
      console.log('⚠️  Coupon "107TYPES" already exists!\n');
      
      // Fetch existing coupon details
      try {
        const existingCoupon = await stripe.coupons.retrieve('107TYPES');
        console.log('📋 Existing Coupon Details:');
        console.log(`   ID:            ${existingCoupon.id}`);
        console.log(`   Discount:      ${existingCoupon.percent_off}% off`);
        console.log(`   Times Used:    ${existingCoupon.times_redeemed}`);
        console.log(`   Valid:         ${existingCoupon.valid ? 'Yes' : 'No'}`);
        console.log('\n💡 Users can enter "107TYPES" at checkout!');
      } catch (e) {
        console.log('Could not fetch existing coupon:', e.message);
      }
    } else {
      console.error('❌ Error creating coupon:', error.message);
    }
  }
}

createCoupon();

