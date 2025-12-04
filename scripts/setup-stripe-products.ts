/**
 * Stripe Product Setup Script
 * 
 * Creates all products and prices in Stripe, then outputs the price IDs
 * to add to your environment variables.
 * 
 * Run with: npx tsx scripts/setup-stripe-products.ts
 */

import Stripe from 'stripe';

// Get the secret key from environment
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

if (!STRIPE_SECRET_KEY) {
  console.error('❌ STRIPE_SECRET_KEY environment variable is required');
  console.error('   Set it with: $env:STRIPE_SECRET_KEY="sk_live_xxx"');
  process.exit(1);
}

const stripe = new Stripe(STRIPE_SECRET_KEY);

interface ProductConfig {
  name: string;
  description: string;
  price: number; // in cents
  type: 'one_time' | 'recurring';
  interval?: 'month' | 'year';
  envKey: string;
  metadata?: Record<string, string>;
}

const products: ProductConfig[] = [
  // Consumer Micro-Transactions
  {
    name: 'Compatibility Report',
    description: 'Detailed personality compatibility comparison with one person',
    price: 299, // $2.99
    type: 'one_time',
    envKey: 'STRIPE_COMPATIBILITY_REPORT_PRICE_ID',
    metadata: { category: 'consumer', product_type: 'compatibility' }
  },
  {
    name: 'Career Deep Dive',
    description: 'All 15+ career matches with salaries, growth trends, and day-in-the-life insights',
    price: 399, // $3.99
    type: 'one_time',
    envKey: 'STRIPE_CAREER_DEEP_DIVE_PRICE_ID',
    metadata: { category: 'consumer', product_type: 'career' }
  },
  {
    name: 'Framework Bundle',
    description: 'Full MBTI, Enneagram, and DISC detailed breakdowns',
    price: 299, // $2.99
    type: 'one_time',
    envKey: 'STRIPE_FRAMEWORK_BUNDLE_PRICE_ID',
    metadata: { category: 'consumer', product_type: 'frameworks' }
  },
  {
    name: 'Growth Plan',
    description: '30-day personalized development challenges based on your personality',
    price: 299, // $2.99
    type: 'one_time',
    envKey: 'STRIPE_GROWTH_PLAN_PRICE_ID',
    metadata: { category: 'consumer', product_type: 'growth_plan' }
  },
  {
    name: 'Full Unlock',
    description: 'Everything included: Compatibility, Career, Frameworks, and Growth Plan',
    price: 799, // $7.99
    type: 'one_time',
    envKey: 'STRIPE_FULL_UNLOCK_PRICE_ID',
    metadata: { category: 'consumer', product_type: 'full_unlock' }
  },
  
  // B2B Assessment Credits
  {
    name: '10 Assessment Credits',
    description: 'Pack of 10 assessment credits for your team or candidates',
    price: 4900, // $49.00
    type: 'one_time',
    envKey: 'STRIPE_CREDITS_10_PRICE_ID',
    metadata: { category: 'b2b', product_type: 'credits', credit_count: '10' }
  },
  {
    name: '25 Assessment Credits',
    description: 'Pack of 25 assessment credits for your team or candidates (19% savings)',
    price: 9900, // $99.00
    type: 'one_time',
    envKey: 'STRIPE_CREDITS_25_PRICE_ID',
    metadata: { category: 'b2b', product_type: 'credits', credit_count: '25' }
  },
  {
    name: '50 Assessment Credits',
    description: 'Pack of 50 assessment credits for your team or candidates (27% savings)',
    price: 17900, // $179.00
    type: 'one_time',
    envKey: 'STRIPE_CREDITS_50_PRICE_ID',
    metadata: { category: 'b2b', product_type: 'credits', credit_count: '50' }
  },
  {
    name: '100 Assessment Credits',
    description: 'Pack of 100 assessment credits for your team or candidates (39% savings)',
    price: 29900, // $299.00
    type: 'one_time',
    envKey: 'STRIPE_CREDITS_100_PRICE_ID',
    metadata: { category: 'b2b', product_type: 'credits', credit_count: '100' }
  },
  
  // B2B Subscriptions
  {
    name: 'Team Starter',
    description: '20 assessments/month, team dashboard, basic analytics',
    price: 7900, // $79.00/month
    type: 'recurring',
    interval: 'month',
    envKey: 'STRIPE_TEAM_STARTER_PRICE_ID',
    metadata: { category: 'b2b', product_type: 'subscription', tier: 'starter', assessments_per_month: '20' }
  },
  {
    name: 'Team Pro',
    description: '60 assessments/month, job-fit scoring, candidate ranking, API access',
    price: 19900, // $199.00/month
    type: 'recurring',
    interval: 'month',
    envKey: 'STRIPE_TEAM_PRO_PRICE_ID',
    metadata: { category: 'b2b', product_type: 'subscription', tier: 'pro', assessments_per_month: '60' }
  },
];

async function createProducts() {
  console.log('🚀 Creating Stripe products...\n');
  
  const envVars: string[] = [];
  const errors: string[] = [];
  
  for (const config of products) {
    try {
      console.log(`Creating: ${config.name}...`);
      
      // Create the product
      const product = await stripe.products.create({
        name: config.name,
        description: config.description,
        metadata: config.metadata,
      });
      
      // Create the price
      const priceParams: Stripe.PriceCreateParams = {
        product: product.id,
        unit_amount: config.price,
        currency: 'usd',
      };
      
      if (config.type === 'recurring' && config.interval) {
        priceParams.recurring = { interval: config.interval };
      }
      
      const price = await stripe.prices.create(priceParams);
      
      console.log(`  ✅ Created: ${price.id}`);
      envVars.push(`${config.envKey}=${price.id}`);
      
    } catch (error: any) {
      console.log(`  ❌ Error: ${error.message}`);
      errors.push(`${config.name}: ${error.message}`);
    }
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('ENVIRONMENT VARIABLES TO ADD:');
  console.log('='.repeat(60) + '\n');
  
  envVars.forEach(line => console.log(line));
  
  console.log('\n' + '='.repeat(60));
  console.log('COPY FOR .env.local:');
  console.log('='.repeat(60) + '\n');
  
  console.log('# Stripe Product Price IDs');
  console.log('# Consumer Micro-Transactions');
  envVars.filter(v => v.includes('COMPATIBILITY') || v.includes('CAREER') || v.includes('FRAMEWORK') || v.includes('GROWTH') || v.includes('FULL_UNLOCK')).forEach(v => console.log(v));
  
  console.log('\n# B2B Credits');
  envVars.filter(v => v.includes('CREDITS')).forEach(v => console.log(v));
  
  console.log('\n# B2B Subscriptions');
  envVars.filter(v => v.includes('TEAM')).forEach(v => console.log(v));
  
  if (errors.length > 0) {
    console.log('\n' + '='.repeat(60));
    console.log('ERRORS:');
    console.log('='.repeat(60) + '\n');
    errors.forEach(e => console.log(`❌ ${e}`));
  }
  
  console.log('\n✨ Done! Copy the environment variables above to:');
  console.log('   1. .env.local (for local development)');
  console.log('   2. Vercel Dashboard → Settings → Environment Variables (for production)');
}

// Run the script
createProducts().catch(console.error);


