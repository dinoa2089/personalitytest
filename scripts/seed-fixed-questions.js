#!/usr/bin/env node
/**
 * Seed Fixed Questions to Supabase
 * 
 * This script:
 * 1. Clears existing questions from the database
 * 2. Seeds the fixed questions (with unique forced-choice text)
 * 
 * Run with: node scripts/seed-fixed-questions.js
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  console.error('❌ Missing NEXT_PUBLIC_SUPABASE_URL');
  process.exit(1);
}

// Prefer service role key, fall back to anon key
const keyToUse = supabaseServiceKey || supabaseAnonKey;
const usingServiceKey = !!supabaseServiceKey;

if (!keyToUse) {
  console.error('❌ Missing Supabase key');
  console.log('   Need either SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY');
  process.exit(1);
}

console.log(`🔑 Using ${usingServiceKey ? 'SERVICE_ROLE_KEY' : 'ANON_KEY'}`);
if (!usingServiceKey) {
  console.log('   ⚠️  Using ANON_KEY - delete may fail if RLS restricts it');
  console.log('   For full access, add SUPABASE_SERVICE_ROLE_KEY to .env.local\n');
}

const supabase = createClient(supabaseUrl, keyToUse);

// Load the fixed questions
const fixedQuestionsPath = path.join(__dirname, 'generated-questions-fixed.json');

async function seedQuestions() {
  console.log('🚀 Seeding fixed questions to Supabase...\n');

  // Check if fixed questions file exists
  if (!fs.existsSync(fixedQuestionsPath)) {
    console.error('❌ generated-questions-fixed.json not found.');
    console.log('   Run: node scripts/fix-duplicate-questions.js first');
    process.exit(1);
  }

  const fixedQuestions = JSON.parse(fs.readFileSync(fixedQuestionsPath, 'utf-8'));
  console.log(`📋 Loaded ${fixedQuestions.length} fixed questions\n`);

  // Step 1: Get count of existing questions
  const { count: existingCount } = await supabase
    .from('questions')
    .select('*', { count: 'exact', head: true });

  console.log(`📊 Found ${existingCount || 0} existing questions in database\n`);

  // Step 2: Ask for confirmation before deleting
  if (existingCount > 0) {
    console.log('⚠️  This will DELETE all existing questions and replace them with fixed ones.');
    console.log('   Press Ctrl+C to cancel, or wait 3 seconds to continue...\n');
    await new Promise(resolve => setTimeout(resolve, 3000));
  }

  // Step 3: Delete existing questions
  if (existingCount > 0) {
    console.log('🗑️  Deleting existing questions...');
    const { error: deleteError } = await supabase
      .from('questions')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all (workaround for "delete all")

    if (deleteError) {
      console.error('❌ Error deleting existing questions:', deleteError.message);
      // Try alternative delete method
      console.log('   Trying alternative delete method...');
      const { error: deleteError2 } = await supabase
        .from('questions')
        .delete()
        .gte('order_index', 0);
      
      if (deleteError2) {
        console.error('❌ Could not delete existing questions:', deleteError2.message);
        console.log('   You may need to manually delete questions from Supabase dashboard.');
        process.exit(1);
      }
    }
    console.log('   ✓ Existing questions deleted\n');
  }

  // Step 4: Format and insert new questions
  console.log('📝 Inserting fixed questions...\n');

  const formattedQuestions = fixedQuestions.map((q, idx) => ({
    text: q.text,
    type: q.type,
    dimension: q.dimension,
    options: q.options || null,
    reverse_scored: q.reverse_scored || false,
    weight: q.weight || 1.0,
    order_index: idx + 1,
    framework_tags: q.framework_tags || [],
    discrimination: q.discrimination || 1.0,
    difficulty: q.difficulty || 0.5,
    is_core: q.is_core || false,
  }));

  // Insert in batches of 50
  const batchSize = 50;
  let inserted = 0;
  let errors = 0;

  for (let i = 0; i < formattedQuestions.length; i += batchSize) {
    const batch = formattedQuestions.slice(i, i + batchSize);
    const batchNum = Math.floor(i / batchSize) + 1;
    const totalBatches = Math.ceil(formattedQuestions.length / batchSize);

    const { data, error } = await supabase
      .from('questions')
      .insert(batch)
      .select('id');

    if (error) {
      console.error(`  ❌ Batch ${batchNum}/${totalBatches} failed:`, error.message);
      errors++;
    } else {
      inserted += data.length;
      console.log(`  ✓ Batch ${batchNum}/${totalBatches} inserted (${inserted}/${formattedQuestions.length})`);
    }
  }

  // Step 5: Verify
  console.log('\n' + '='.repeat(60));
  console.log('📈 SEEDING SUMMARY');
  console.log('='.repeat(60));
  console.log(`Questions to insert: ${formattedQuestions.length}`);
  console.log(`Successfully inserted: ${inserted}`);
  console.log(`Failed batches: ${errors}`);

  // Get final count
  const { count: finalCount } = await supabase
    .from('questions')
    .select('*', { count: 'exact', head: true });

  console.log(`\n📊 Total questions in database: ${finalCount}`);

  // Show breakdown by dimension
  const { data: dimCounts } = await supabase
    .from('questions')
    .select('dimension');

  if (dimCounts) {
    const counts = {};
    dimCounts.forEach(q => {
      counts[q.dimension] = (counts[q.dimension] || 0) + 1;
    });
    console.log('\n📋 Questions by dimension:');
    Object.entries(counts).sort().forEach(([dim, count]) => {
      console.log(`   ${dim}: ${count}`);
    });
  }

  // Show breakdown by type
  const { data: typeCounts } = await supabase
    .from('questions')
    .select('type');

  if (typeCounts) {
    const counts = {};
    typeCounts.forEach(q => {
      counts[q.type] = (counts[q.type] || 0) + 1;
    });
    console.log('\n📋 Questions by type:');
    Object.entries(counts).sort().forEach(([type, count]) => {
      console.log(`   ${type}: ${count}`);
    });
  }

  if (errors === 0) {
    console.log('\n🎉 Successfully seeded all fixed questions!');
    console.log('\nYou can now restart the app and take the assessment.');
    console.log('Questions will be selected adaptively without duplicates.');
  } else {
    console.log('\n⚠️  Completed with some errors. Check the output above.');
  }

  console.log('='.repeat(60));
}

seedQuestions().catch(console.error);

