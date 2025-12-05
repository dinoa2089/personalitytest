/**
 * Sync new ENTJ-style questions to the database
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

// Find new ENTJ-style questions (UUID format)
const newQuestions = mockQuestions.filter(q => q.id.startsWith('a1b2c3d4-'));

console.log('=== SYNCING NEW ENTJ-STYLE QUESTIONS ===\n');
console.log('Found', newQuestions.length, 'new questions to sync');

async function syncNewQuestions() {
  for (const q of newQuestions) {
    // Check if exists
    const { data: existing } = await supabase
      .from('questions')
      .select('id')
      .eq('id', q.id)
      .single();
    
    if (existing) {
      console.log('Already exists:', q.id);
      continue;
    }
    
    // Insert new question
    const { error } = await supabase
      .from('questions')
      .insert({
        id: q.id,
        text: q.text,
        type: q.type,
        dimension: q.dimension,
        reverse_scored: q.reverse_scored || false,
        weight: q.weight || 1,
        discrimination: q.discrimination || 1,
        framework_tags: q.framework_tags || [],
        is_core: false,
        options: q.options || null
      });
    
    if (error) {
      console.error('Error inserting', q.id + ':', error.message);
    } else {
      console.log('✅ Inserted:', q.text.substring(0, 50) + '...');
    }
  }
  
  console.log('\n=== SYNC COMPLETE ===');
}

syncNewQuestions().catch(console.error);

