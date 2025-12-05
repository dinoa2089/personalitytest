/**
 * Sync the 5 J/P reverse_scored fixes to the production database
 */
const { createClient } = require('@supabase/supabase-js');

// Hardcoded for debugging
const supabaseUrl = 'https://eqkcmlxxuubibzoqliee.supabase.co';
const supabaseServiceKey = 'sb_secret_tCzyDalDHDI-iQqxGXx6Nw_qyb5kJej';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// The 5 questions that need reverse_scored changed from false to true
const questionsToFix = [
  {
    id: '22b0b255-373a-4e5a-968a-30a5ea461bc6',
    text: 'When project goals change unexpectedly, I immediately adjust my workflow.'
  },
  {
    id: '2d5368f2-4ff0-4e69-89a9-4e1f894b43fb',
    text: 'When my initial problem-solving approach fails, I quickly switch to a different strategy.'
  },
  {
    id: '836d3c69-2fe9-480c-bcd2-b948690b46e4',
    text: 'I enjoy trying new approaches even when current methods work well.'
  },
  {
    id: '8f568ccb-c550-4448-a97f-a3dabf51b219',
    text: 'I easily adjust my plans when circumstances change.'
  },
  {
    id: 'bda495c8-d64e-4ac1-a3cd-3f4008f62e7d',
    text: 'I reprioritize my daily tasks immediately when I receive new critical information.'
  }
];

async function syncFixes() {
  console.log('\n=== SYNCING J/P FIXES TO DATABASE ===\n');
  
  for (const q of questionsToFix) {
    // First verify the question exists and check current value
    const { data: existing, error: fetchError } = await supabase
      .from('questions')
      .select('id, text, reverse_scored')
      .eq('id', q.id)
      .single();
    
    if (fetchError) {
      console.log('❌ Error fetching ' + q.id + ': ' + fetchError.message);
      continue;
    }
    
    if (!existing) {
      console.log('❌ Question not found: ' + q.id);
      continue;
    }
    
    console.log('Found: ' + existing.text.substring(0, 50) + '...');
    console.log('  Current reverse_scored: ' + existing.reverse_scored);
    
    if (existing.reverse_scored === true) {
      console.log('  ✅ Already correct, skipping');
      console.log('');
      continue;
    }
    
    // Update to true
    const { error: updateError } = await supabase
      .from('questions')
      .update({ reverse_scored: true })
      .eq('id', q.id);
    
    if (updateError) {
      console.log('  ❌ Error updating: ' + updateError.message);
    } else {
      console.log('  ✅ Updated to reverse_scored: true');
    }
    console.log('');
  }
  
  console.log('=== SYNC COMPLETE ===\n');
}

syncFixes().catch(console.error);

