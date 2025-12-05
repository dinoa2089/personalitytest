/**
 * Sync ALL reverse_scored fixes to the production database
 * 
 * This script ensures the database matches the corrected mock-questions.ts file.
 */
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

// Hardcoded for debugging
const supabaseUrl = 'https://eqkcmlxxuubibzoqliee.supabase.co';
const supabaseServiceKey = 'sb_secret_tCzyDalDHDI-iQqxGXx6Nw_qyb5kJej';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Load mock questions
const content = fs.readFileSync('lib/mock-questions.ts', 'utf8');
const arrayMatch = content.match(/export const mockQuestions[^=]*=\s*(\[[\s\S]*\]);?\s*$/);
let mockQuestions = [];
if (arrayMatch) {
  let jsonStr = arrayMatch[1].trim();
  if (jsonStr.endsWith(';')) jsonStr = jsonStr.slice(0, -1);
  mockQuestions = JSON.parse(jsonStr);
}

console.log('Loaded', mockQuestions.length, 'mock questions');

async function syncAll() {
  console.log('\n=== SYNCING ALL REVERSE_SCORED TO DATABASE ===\n');
  
  let updated = 0;
  let matched = 0;
  let notFound = 0;
  let errors = 0;
  
  // Get all questions from database
  const { data: dbQuestions, error: fetchError } = await supabase
    .from('questions')
    .select('id, reverse_scored');
  
  if (fetchError) {
    console.error('Error fetching questions:', fetchError);
    return;
  }
  
  const dbMap = {};
  dbQuestions.forEach(q => dbMap[q.id] = q.reverse_scored);
  
  // Compare and update
  for (const mockQ of mockQuestions) {
    const dbReverse = dbMap[mockQ.id];
    const mockReverse = mockQ.reverse_scored || false;
    
    if (dbReverse === undefined) {
      notFound++;
      continue;
    }
    
    if (dbReverse === mockReverse) {
      matched++;
      continue;
    }
    
    // Update database
    const { error: updateError } = await supabase
      .from('questions')
      .update({ reverse_scored: mockReverse })
      .eq('id', mockQ.id);
    
    if (updateError) {
      console.error('Error updating', mockQ.id, ':', updateError.message);
      errors++;
    } else {
      console.log('Updated:', mockQ.text.substring(0, 50) + '...');
      console.log('  ' + dbReverse + ' → ' + mockReverse);
      updated++;
    }
  }
  
  console.log('\n=== SYNC COMPLETE ===');
  console.log('Already matched:', matched);
  console.log('Updated:', updated);
  console.log('Not found in DB:', notFound);
  console.log('Errors:', errors);
}

syncAll().catch(console.error);

