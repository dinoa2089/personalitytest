/**
 * Remove Near-Duplicate Questions
 * 
 * This script identifies and removes near-duplicate questions that hurt UX
 * by asking essentially the same thing multiple times.
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Questions to KEEP (the best version of each concept)
const KEEP_QUESTION_IDS = [
  // Planning - keep ONE good question
  '40132e24-429b-4c4c-adf8-29bdb8070bb2', // "I create detailed plans before starting projects." - KEEP (clear, direct)
  
  // Adaptability to plan changes - keep ONE 
  '8f568ccb-c550-4448-a97f-a3dabf51b219', // "I easily adjust my plans when circumstances change." - KEEP
];

// Questions to REMOVE (duplicates/near-duplicates)
const REMOVE_QUESTION_IDS = [
  // Near-duplicates of "I create detailed plans..."
  '7fba0e7e-78cb-4b62-9f5e-a73a2d31d651', // "I prefer to approach my day without a specific schedule or plan." - REMOVE (reverse of same concept)
  'cd768c2e-83fb-43ef-a6c0-ab4f9182b862', // "I prepare a detailed checklist or itinerary before starting a complex activity." - REMOVE (same as detailed plans)
  'e67c9007-506a-4c2c-90f5-8bf32aca7728', // "I feel most comfortable when my daily activities are planned out in advance." - REMOVE (same concept)
  'ac15707b-75c2-47e0-9d43-cd400507d8a3', // "I struggle to take action when I do not have a detailed plan in place." - REMOVE (measures same trait)
];

async function analyzeDuplicates() {
  console.log('🔍 Analyzing question database for duplicates...\n');
  
  // Fetch all questions
  const { data: questions, error } = await supabase
    .from('questions')
    .select('id, text, type, dimension')
    .order('dimension');
  
  if (error) {
    console.error('❌ Error fetching questions:', error);
    return;
  }

  console.log(`📊 Total questions in database: ${questions.length}\n`);

  // Find questions about planning
  const planningQuestions = questions.filter(q => 
    q.text.toLowerCase().includes('plan') || 
    q.text.toLowerCase().includes('schedule') ||
    q.text.toLowerCase().includes('checklist') ||
    q.text.toLowerCase().includes('itinerary')
  );

  console.log('📋 Questions mentioning "plan/schedule/checklist":');
  console.log('=' .repeat(80));
  
  planningQuestions.forEach(q => {
    const shouldRemove = REMOVE_QUESTION_IDS.includes(q.id);
    const shouldKeep = KEEP_QUESTION_IDS.includes(q.id);
    const status = shouldRemove ? '❌ REMOVE' : shouldKeep ? '✅ KEEP' : '⚪ REVIEW';
    
    console.log(`\n${status}`);
    console.log(`  ID: ${q.id}`);
    console.log(`  Type: ${q.type} | Dimension: ${q.dimension}`);
    console.log(`  Text: "${q.text.substring(0, 100)}${q.text.length > 100 ? '...' : ''}"`);
  });

  console.log('\n' + '='.repeat(80));
  console.log(`\n📊 Summary:`);
  console.log(`   Total planning-related questions: ${planningQuestions.length}`);
  console.log(`   Questions marked for removal: ${REMOVE_QUESTION_IDS.length}`);
  console.log(`   Questions to keep: ${KEEP_QUESTION_IDS.length}`);
  
  return planningQuestions;
}

async function removeDuplicates(dryRun = true) {
  if (dryRun) {
    console.log('\n🔄 DRY RUN - No changes will be made\n');
  } else {
    console.log('\n⚠️  LIVE RUN - Questions will be deleted!\n');
  }

  for (const id of REMOVE_QUESTION_IDS) {
    // First, get the question details
    const { data: question, error: fetchError } = await supabase
      .from('questions')
      .select('id, text')
      .eq('id', id)
      .single();

    if (fetchError || !question) {
      console.log(`⚪ Question ${id} not found (may already be deleted)`);
      continue;
    }

    console.log(`\n${dryRun ? '🔍 Would delete' : '🗑️  Deleting'}:`);
    console.log(`   ID: ${id}`);
    console.log(`   Text: "${question.text.substring(0, 60)}..."`);

    if (!dryRun) {
      const { error: deleteError } = await supabase
        .from('questions')
        .delete()
        .eq('id', id);

      if (deleteError) {
        console.log(`   ❌ Error: ${deleteError.message}`);
      } else {
        console.log(`   ✅ Deleted successfully`);
      }
    }
  }

  console.log('\n' + '='.repeat(80));
  if (dryRun) {
    console.log('\n✅ Dry run complete. Run with --live to actually delete questions.');
    console.log('   Command: node scripts/remove-duplicate-questions.js --live');
  } else {
    console.log('\n✅ Duplicate questions removed!');
  }
}

async function main() {
  const isLive = process.argv.includes('--live');
  const analyzeOnly = process.argv.includes('--analyze');

  console.log('🧹 Question Deduplication Tool\n');
  
  await analyzeDuplicates();

  if (!analyzeOnly) {
    await removeDuplicates(!isLive);
  }
}

main().catch(console.error);


