#!/usr/bin/env node
/**
 * Seed generated questions into Supabase
 * Loads questions from generated-questions.json and inserts them into the database
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials');
  console.log('   NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✓ Set' : '✗ Missing');
  console.log('   SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? '✓ Set' : '✗ Missing');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function seedQuestions() {
  console.log('🚀 Seeding generated questions into Supabase...\n');

  // Load questions from JSON file
  const questionsPath = path.join(__dirname, 'generated-questions.json');
  
  if (!fs.existsSync(questionsPath)) {
    console.error('❌ generated-questions.json not found. Run generate-questions-ai.ts first.');
    process.exit(1);
  }

  const questions = JSON.parse(fs.readFileSync(questionsPath, 'utf-8'));
  console.log(`📋 Loaded ${questions.length} questions from JSON file\n`);

  // Get current max order_index
  const { data: maxOrderData } = await supabase
    .from('questions')
    .select('order_index')
    .order('order_index', { ascending: false })
    .limit(1)
    .single();

  let orderIndex = (maxOrderData?.order_index || 0) + 1;
  console.log(`📊 Starting order_index at ${orderIndex}\n`);

  // Format questions for insert (matching existing database schema)
  const formattedQuestions = questions.map((q, idx) => ({
    text: q.text,
    type: q.type,
    dimension: q.dimension,
    options: q.options || null,
    reverse_scored: q.reverse_scored || false,
    weight: q.weight || 1.0,
    order_index: orderIndex + idx,
  }));

  // Insert in batches of 50
  const batchSize = 50;
  let inserted = 0;
  let errors = 0;

  for (let i = 0; i < formattedQuestions.length; i += batchSize) {
    const batch = formattedQuestions.slice(i, i + batchSize);
    const batchNum = Math.floor(i / batchSize) + 1;
    const totalBatches = Math.ceil(formattedQuestions.length / batchSize);

    const { error } = await supabase.from('questions').insert(batch);

    if (error) {
      console.error(`  ❌ Batch ${batchNum}/${totalBatches} failed:`, error.message);
      errors++;
    } else {
      inserted += batch.length;
      console.log(`  ✓ Batch ${batchNum}/${totalBatches} inserted (${inserted}/${formattedQuestions.length})`);
    }
  }

  console.log('\n================================');
  console.log('📈 SEEDING SUMMARY');
  console.log('================================');
  console.log(`Total questions: ${formattedQuestions.length}`);
  console.log(`Successfully inserted: ${inserted}`);
  console.log(`Failed batches: ${errors}`);

  // Verify count
  const { count } = await supabase
    .from('questions')
    .select('*', { count: 'exact', head: true });

  console.log(`\n📊 Total questions in database: ${count}`);
  console.log('\n🎉 Seeding complete!');
}

seedQuestions().catch(console.error);

