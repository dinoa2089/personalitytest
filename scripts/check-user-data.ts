/**
 * Script to check user assessment data from Supabase
 * Run with: npx tsx scripts/check-user-data.ts
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials. Check .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const sessionId = '71ff03af-fe2f-4057-ae40-6f8424838904';
const userEmail = 'dean@beansdollconsulting.co';

async function checkUserData() {
  console.log('\n=== Checking User Data ===\n');
  
  // 1. Find user by email
  console.log(`Looking up user: ${userEmail}`);
  const { data: users, error: userError } = await supabase
    .from('users')
    .select('*')
    .eq('email', userEmail);
    
  if (userError) {
    console.error('User lookup error:', userError);
  } else {
    console.log('User found:', users);
  }
  
  // 2. Get assessment session
  console.log(`\nLooking up session: ${sessionId}`);
  const { data: session, error: sessionError } = await supabase
    .from('assessment_sessions')
    .select('*')
    .eq('id', sessionId)
    .single();
    
  if (sessionError) {
    console.error('Session lookup error:', sessionError);
  } else {
    console.log('Session found:', JSON.stringify(session, null, 2));
  }
  
  // 3. Get assessment responses
  console.log(`\nLooking up responses for session: ${sessionId}`);
  const { data: responses, error: responsesError } = await supabase
    .from('assessment_responses')
    .select(`
      id,
      question_id,
      response,
      dimension,
      response_time_ms,
      created_at,
      questions (
        id,
        text,
        type,
        dimension,
        options,
        reverse_scored
      )
    `)
    .eq('session_id', sessionId)
    .order('created_at', { ascending: true });
    
  if (responsesError) {
    console.error('Responses lookup error:', responsesError);
  } else {
    console.log(`Found ${responses?.length || 0} responses:`);
    responses?.forEach((r, i) => {
      const q = r.questions as any;
      console.log(`\n--- Response ${i + 1} ---`);
      console.log(`Question: ${q?.text?.substring(0, 80)}...`);
      console.log(`Type: ${q?.type}`);
      console.log(`Dimension: ${r.dimension}`);
      console.log(`Response: ${JSON.stringify(r.response)}`);
      console.log(`Reverse scored: ${q?.reverse_scored}`);
    });
  }
  
  // 4. Get assessment results
  console.log(`\n\n=== Assessment Results ===`);
  const { data: results, error: resultsError } = await supabase
    .from('assessment_results')
    .select('*')
    .eq('session_id', sessionId);
    
  if (resultsError) {
    console.error('Results lookup error:', resultsError);
  } else {
    console.log('Results:', JSON.stringify(results, null, 2));
  }
  
  // 5. Check user's premium/purchases status
  console.log(`\n\n=== Premium Status Check ===`);
  if (users && users.length > 0) {
    const userId = users[0].id;
    
    // Check purchases
    const { data: purchases, error: purchasesError } = await supabase
      .from('purchases')
      .select('*')
      .eq('user_id', userId);
      
    if (purchasesError) {
      console.error('Purchases lookup error:', purchasesError);
    } else {
      console.log('Purchases:', purchases);
    }
    
    // Check referrals
    const { data: referralCodes, error: refError } = await supabase
      .from('referral_codes')
      .select('*')
      .eq('user_id', userId);
      
    if (refError) {
      console.error('Referral codes lookup error:', refError);
    } else {
      console.log('Referral codes:', referralCodes);
    }
    
    // Check completed referrals
    const { data: referrals, error: refCompError } = await supabase
      .from('referrals')
      .select('*')
      .eq('referrer_user_id', userId);
      
    if (refCompError) {
      console.error('Referrals lookup error:', refCompError);
    } else {
      console.log('Completed referrals:', referrals);
    }
  }
}

checkUserData().catch(console.error);

