/**
 * Diversify Duplicate Questions
 * 
 * Updates near-duplicate questions to measure the same trait 
 * from conceptually different angles.
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Check for --sql or --show flags which don't need database
const showOnly = process.argv.includes('--sql') || process.argv.includes('--show');

let supabase = null;

if (!showOnly) {
  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing SUPABASE_SERVICE_ROLE_KEY in .env.local');
    console.log('This script requires the service role key to update questions.');
    console.log('Use --show to just view proposed changes without database connection.');
    process.exit(1);
  }
  supabase = createClient(supabaseUrl, supabaseKey);
}

// Questions to update with new, conceptually distinct phrasing
const QUESTION_UPDATES = [
  // ============================================================================
  // PLANNING/CONSCIENTIOUSNESS - Diversify from different angles
  // ============================================================================
  {
    id: 'cd768c2e-83fb-43ef-a6c0-ab4f9182b862',
    current: 'I prepare a detailed checklist or itinerary before starting a complex activity.',
    updated: 'I mentally walk through important events before they happen.',
    rationale: 'Measures COGNITIVE planning (mental rehearsal) instead of written planning',
    dimension: 'conscientiousness'
  },
  {
    id: 'e67c9007-506a-4c2c-90f5-8bf32aca7728',
    current: 'I feel most comfortable when my daily activities are planned out in advance.',
    updated: 'I know what I will be doing this time next week.',
    rationale: 'Measures TIME HORIZON of planning with concrete behavioral indicator',
    dimension: 'conscientiousness'
  },
  {
    id: 'ac15707b-75c2-47e0-9d43-cd400507d8a3',
    current: 'I struggle to take action when I do not have a detailed plan in place.',
    updated: 'I usually have a backup approach ready if my first plan does not work.',
    rationale: 'Measures CONTINGENCY thinking (positive frame) instead of paralysis (negative frame)',
    dimension: 'adaptability'
  },
  {
    id: '7fba0e7e-78cb-4b62-9f5e-a73a2d31d651',
    current: 'I prefer to approach my day without a specific schedule or plan.',
    updated: 'I enjoy it when a friend calls with spontaneous weekend plans.',
    rationale: 'Measures SPONTANEITY COMFORT in social context instead of abstract preference',
    dimension: 'conscientiousness'
  },
  
  // ============================================================================
  // TASKS/CONSCIENTIOUSNESS - The "unfinished tasks" duplicates
  // ============================================================================
  {
    id: null, // Will find by text match
    currentMatch: 'I often leave tasks unfinished to start working on something new.',
    updated: 'I tend to have multiple projects in progress at the same time.',
    rationale: 'Measures MULTI-TASKING behavior neutrally instead of negative "unfinished" framing',
    dimension: 'conscientiousness'
  },
  
  // ============================================================================
  // ADAPTABILITY - The "proven methods" duplicates
  // ============================================================================
  {
    id: null,
    currentMatch: 'I prefer to use established methods to solve problems rather than experimenting with new techniques.',
    updated: 'I try a different approach when my usual method is not working.',
    rationale: 'Measures REACTIVE flexibility instead of proactive experimentation preference',
    dimension: 'openness'
  },
  
  // ============================================================================
  // CHANGE/ADAPTABILITY - Diversify angles
  // ============================================================================
  {
    id: null,
    currentMatch: 'I find it stressful when my routine is disrupted.',
    updated: 'When meetings get rescheduled last minute, I feel more frustrated than accepting.',
    rationale: 'Measures EMOTIONAL RESPONSE to specific common scenario instead of abstract stress',
    dimension: 'adaptability'
  },
  {
    id: null,
    currentMatch: 'I feel uneasy when my daily routine is interrupted without warning.',
    updated: 'I deliberately change my personal routines every few months to keep things interesting.',
    rationale: 'Measures PROACTIVE change-seeking instead of reactive discomfort',
    dimension: 'adaptability'
  },
  
  // ============================================================================
  // STRESS/RESILIENCE - Diversify angles
  // ============================================================================
  {
    id: null,
    currentMatch: 'I feel overwhelmed when I have multiple urgent tasks to complete at once.',
    updated: 'Stressful situations rarely affect my sleep quality.',
    rationale: 'Measures PHYSICAL manifestation of stress instead of cognitive overwhelm',
    dimension: 'emotionalResilience'
  },
  
  // ============================================================================
  // SOCIAL/EXTRAVERSION - Diversify angles
  // ============================================================================
  {
    id: null,
    currentMatch: 'I find myself feeling drained or tired after spending several hours in a large social gathering.',
    updated: 'I prefer dinner with six people over dinner with two.',
    rationale: 'Measures GROUP SIZE preference instead of energy drain',
    dimension: 'extraversion'
  },
  {
    id: null,
    currentMatch: 'I attempt to blend into the background during large gatherings.',
    updated: 'I am usually the one who suggests getting together with friends.',
    rationale: 'Measures SOCIAL INITIATIVE instead of visibility preference',
    dimension: 'extraversion'
  },
];

async function findQuestionByText(text) {
  const { data, error } = await supabase
    .from('questions')
    .select('id, text')
    .ilike('text', `%${text.substring(0, 50)}%`)
    .limit(1)
    .single();
  
  if (error || !data) {
    return null;
  }
  return data;
}

async function updateQuestions(dryRun = true) {
  console.log('🔄 Question Diversification Tool\n');
  console.log(dryRun ? '📋 DRY RUN - No changes will be made\n' : '⚠️  LIVE RUN - Updating database\n');
  console.log('='.repeat(100));
  
  let successCount = 0;
  let skipCount = 0;
  let errorCount = 0;
  
  for (const update of QUESTION_UPDATES) {
    let questionId = update.id;
    let currentText = update.current || update.currentMatch;
    
    // If no ID, find by text match
    if (!questionId && update.currentMatch) {
      const found = await findQuestionByText(update.currentMatch);
      if (found) {
        questionId = found.id;
        currentText = found.text;
      } else {
        console.log(`\n⚪ SKIP: Could not find question matching "${update.currentMatch.substring(0, 50)}..."`);
        skipCount++;
        continue;
      }
    }
    
    console.log(`\n📝 ${update.dimension.toUpperCase()}`);
    console.log(`   ID: ${questionId}`);
    console.log(`   CURRENT:  "${currentText.substring(0, 70)}${currentText.length > 70 ? '...' : ''}"`);
    console.log(`   NEW:      "${update.updated}"`);
    console.log(`   REASON:   ${update.rationale}`);
    
    if (!dryRun) {
      const { error } = await supabase
        .from('questions')
        .update({ text: update.updated })
        .eq('id', questionId);
      
      if (error) {
        console.log(`   ❌ ERROR: ${error.message}`);
        errorCount++;
      } else {
        console.log(`   ✅ Updated successfully`);
        successCount++;
      }
    } else {
      console.log(`   🔍 Would update...`);
      successCount++;
    }
  }
  
  console.log('\n' + '='.repeat(100));
  console.log('\n📊 SUMMARY');
  console.log(`   Would update: ${successCount}`);
  console.log(`   Skipped (not found): ${skipCount}`);
  console.log(`   Errors: ${errorCount}`);
  
  if (dryRun) {
    console.log('\n✅ Dry run complete. Review changes above.');
    console.log('   To apply changes, run: node scripts/diversify-questions.js --live');
  } else {
    console.log('\n✅ Questions diversified!');
    console.log('   Users will now see conceptually distinct questions.');
  }
}

// Also output the changes as SQL for manual review
function generateSQL() {
  console.log('\n\n' + '='.repeat(100));
  console.log('📄 SQL UPDATE STATEMENTS (for manual review/backup)\n');
  
  for (const update of QUESTION_UPDATES) {
    if (update.id) {
      const escaped = update.updated.replace(/'/g, "''");
      console.log(`-- ${update.rationale}`);
      console.log(`UPDATE questions SET text = '${escaped}' WHERE id = '${update.id}';`);
      console.log('');
    }
  }
}

function showProposedChanges() {
  console.log('🔄 PROPOSED QUESTION DIVERSIFICATION\n');
  console.log('The following questions will be rephrased to measure the same traits');
  console.log('from conceptually DIFFERENT angles:\n');
  console.log('='.repeat(100));
  
  for (const update of QUESTION_UPDATES) {
    const currentText = update.current || update.currentMatch;
    console.log(`\n📝 ${update.dimension.toUpperCase()}`);
    console.log(`   ❌ CURRENT:  "${currentText}"`);
    console.log(`   ✅ PROPOSED: "${update.updated}"`);
    console.log(`   💡 WHY:      ${update.rationale}`);
  }
  
  console.log('\n' + '='.repeat(100));
  console.log('\n📊 TOTAL: ' + QUESTION_UPDATES.length + ' questions to diversify\n');
}

async function main() {
  const isLive = process.argv.includes('--live');
  const showSQL = process.argv.includes('--sql');
  const showOnly = process.argv.includes('--show');
  
  if (showOnly) {
    showProposedChanges();
  } else if (showSQL) {
    generateSQL();
  } else {
    await updateQuestions(!isLive);
  }
}

main().catch(console.error);

