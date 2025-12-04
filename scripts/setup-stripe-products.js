/**
 * Setup Stripe Products and Prices
 * 
 * Run this script to create all required Stripe products and prices.
 * 
 * Usage:
 *   1. Set your STRIPE_SECRET_KEY environment variable
 *   2. Run: node scripts/setup-stripe-products.js
 *   3. Copy the output price IDs to your Vercel environment variables
 */

const Stripe = require('stripe');

// Get API key from environment
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

if (!STRIPE_SECRET_KEY) {
  console.error('❌ Error: STRIPE_SECRET_KEY environment variable is required');
  console.log('\nUsage:');
  console.log('  Windows PowerShell:');
  console.log('    $env:STRIPE_SECRET_KEY="sk_test_xxx"; node scripts/setup-stripe-products.js');
  console.log('\n  Mac/Linux:');
  console.log('    STRIPE_SECRET_KEY=sk_test_xxx node scripts/setup-stripe-products.js');
  process.exit(1);
}

const stripe = new Stripe(STRIPE_SECRET_KEY);

// Products to create
const products = [
  // Consumer product
  {
    id: 'full_unlock',
    name: 'Full Results - Individual',
    description: 'Complete personality profile with all career matches, MBTI & Enneagram mappings, compatibility insights, famous examples, and growth recommendations. One-time purchase, yours forever.',
    price: 499, // $4.99 in cents
    envVar: 'STRIPE_FULL_UNLOCK_PRICE_ID',
  },
  
  // Employer products
  {
    id: 'employer_assessment',
    name: 'Single Assessment - Employer',
    description: 'One candidate personality assessment with job fit scoring and detailed report.',
    price: 1500, // $15.00
    envVar: 'STRIPE_EMPLOYER_ASSESSMENT_PRICE_ID',
  },
  {
    id: 'codes_10',
    name: '10 Assessment Pack',
    description: '10 candidate assessments at $12 each. Includes job fit scoring, candidate ranking, and AI job analysis.',
    price: 12000, // $120.00
    envVar: 'STRIPE_CODES_10_PRICE_ID',
  },
  {
    id: 'codes_25',
    name: '25 Assessment Pack',
    description: '25 candidate assessments at $10 each. Best value for growing teams. Includes team composition analysis.',
    price: 25000, // $250.00
    envVar: 'STRIPE_CODES_25_PRICE_ID',
  },
  {
    id: 'codes_50',
    name: '50 Assessment Pack',
    description: '50 candidate assessments at $10 each. For serious hiring. Includes priority support.',
    price: 50000, // $500.00
    envVar: 'STRIPE_CODES_50_PRICE_ID',
  },
  {
    id: 'codes_100',
    name: '100 Assessment Pack',
    description: '100 candidate assessments at $10 each. Enterprise volume. Includes bulk candidate import.',
    price: 100000, // $1,000.00
    envVar: 'STRIPE_CODES_100_PRICE_ID',
  },
];

async function createProducts() {
  console.log('🚀 Creating Stripe products and prices...\n');
  
  const results = [];
  
  for (const product of products) {
    try {
      // Check if product already exists by searching
      const existingProducts = await stripe.products.search({
        query: `name:"${product.name}"`,
      });
      
      let stripeProduct;
      
      if (existingProducts.data.length > 0) {
        stripeProduct = existingProducts.data[0];
        console.log(`📦 Product exists: ${product.name} (${stripeProduct.id})`);
      } else {
        // Create product
        stripeProduct = await stripe.products.create({
          name: product.name,
          description: product.description,
          metadata: {
            product_id: product.id,
          },
        });
        console.log(`✅ Created product: ${product.name} (${stripeProduct.id})`);
      }
      
      // Check if price already exists
      const existingPrices = await stripe.prices.list({
        product: stripeProduct.id,
        active: true,
      });
      
      const matchingPrice = existingPrices.data.find(
        p => p.unit_amount === product.price && p.currency === 'usd'
      );
      
      let stripePrice;
      
      if (matchingPrice) {
        stripePrice = matchingPrice;
        console.log(`💰 Price exists: $${(product.price / 100).toFixed(2)} (${stripePrice.id})`);
      } else {
        // Create price
        stripePrice = await stripe.prices.create({
          product: stripeProduct.id,
          unit_amount: product.price,
          currency: 'usd',
          metadata: {
            product_id: product.id,
          },
        });
        console.log(`✅ Created price: $${(product.price / 100).toFixed(2)} (${stripePrice.id})`);
      }
      
      results.push({
        name: product.name,
        envVar: product.envVar,
        priceId: stripePrice.id,
        amount: `$${(product.price / 100).toFixed(2)}`,
      });
      
      console.log('');
    } catch (error) {
      console.error(`❌ Error creating ${product.name}:`, error.message);
    }
  }
  
  // Output summary
  console.log('\n' + '='.repeat(60));
  console.log('📋 ENVIRONMENT VARIABLES TO SET IN VERCEL:');
  console.log('='.repeat(60) + '\n');
  
  for (const result of results) {
    console.log(`${result.envVar}=${result.priceId}`);
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('📋 COPY-PASTE FOR VERCEL (one line each):');
  console.log('='.repeat(60) + '\n');
  
  for (const result of results) {
    console.log(`${result.envVar}`);
    console.log(`${result.priceId}`);
    console.log('');
  }
  
  console.log('='.repeat(60));
  console.log('✅ Done! Add these to Vercel → Project Settings → Environment Variables');
  console.log('='.repeat(60));
}

createProducts().catch(console.error);


