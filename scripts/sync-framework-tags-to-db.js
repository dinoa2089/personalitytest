/**
 * SYNC FRAMEWORK TAGS TO DATABASE
 * 
 * This script syncs the rich MBTI and Enneagram framework_tags 
 * from mock-questions.ts to the production Supabase database.
 * 
 * Run with: node scripts/sync-framework-tags-to-db.js
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Load mock questions by parsing the TypeScript file
const mockQuestionsPath = path.join(__dirname, '../lib/mock-questions.ts');
const mockQuestionsContent = fs.readFileSync(mockQuestionsPath, 'utf8');

// Find the array start (after "= [") and extract to the final "];"
const arrayMatch = mockQuestionsContent.match(/export const mockQuestions[^=]*=\s*(\[[\s\S]*\]);?\s*$/);

let mockQuestions;
if (arrayMatch) {
  try {
    // The array is valid JSON, just need to handle trailing semicolon
    let jsonStr = arrayMatch[1].trim();
    if (jsonStr.endsWith(';')) jsonStr = jsonStr.slice(0, -1);
    mockQuestions = JSON.parse(jsonStr);
    console.log(`Parsed ${mockQuestions.length} questions from mock-questions.ts`);
  } catch (e) {
    console.error('Failed to parse JSON array:', e.message);
    process.exit(1);
  }
} else {
  console.error('Could not find mockQuestions array in file');
  process.exit(1);
}

async function syncFrameworkTags() {
  console.log('\n' + '='.repeat(60));
  console.log('  SYNCING FRAMEWORK TAGS TO DATABASE');
  console.log('='.repeat(60) + '\n');

  // 1. Get all questions from database
  const { data: dbQuestions, error: fetchError } = await supabase
    .from('questions')
    .select('id, text, framework_tags');

  if (fetchError) {
    console.error('Error fetching database questions:', fetchError);
    process.exit(1);
  }

  console.log(`Found ${dbQuestions.length} questions in database`);
  console.log(`Found ${mockQuestions.length} questions in mock-questions.ts\n`);

  // 2. Create a map of question text -> framework tags from mock questions
  const mockTagsMap = new Map();
  mockQuestions.forEach(q => {
    // Normalize text for matching
    const normalizedText = q.text.toLowerCase().trim().replace(/\s+/g, ' ');
    mockTagsMap.set(normalizedText, {
      framework_tags: q.framework_tags || [],
      original_text: q.text
    });
  });

  // 3. Match and prepare updates
  let matched = 0;
  let unmatched = 0;
  let alreadyHasTags = 0;
  const updates = [];

  for (const dbQ of dbQuestions) {
    const normalizedDbText = dbQ.text.toLowerCase().trim().replace(/\s+/g, ' ');
    const mockData = mockTagsMap.get(normalizedDbText);

    if (mockData) {
      matched++;
      
      // Check if database question is missing MBTI or Enneagram tags
      const dbTags = dbQ.framework_tags || [];
      const hasMbti = dbTags.some(t => t.startsWith('mbti_'));
      const hasEnneagram = dbTags.some(t => t.startsWith('enneagram_'));
      
      const mockHasMbti = mockData.framework_tags.some(t => t.startsWith('mbti_'));
      const mockHasEnneagram = mockData.framework_tags.some(t => t.startsWith('enneagram_'));

      if ((mockHasMbti && !hasMbti) || (mockHasEnneagram && !hasEnneagram)) {
        // Merge tags (keep existing + add new from mock)
        const mergedTags = [...new Set([...dbTags, ...mockData.framework_tags])];
        
        updates.push({
          id: dbQ.id,
          framework_tags: mergedTags,
          text_preview: dbQ.text.substring(0, 50)
        });
      } else {
        alreadyHasTags++;
      }
    } else {
      unmatched++;
    }
  }

  console.log(`Matched: ${matched} questions`);
  console.log(`Unmatched: ${unmatched} questions`);
  console.log(`Already have full tags: ${alreadyHasTags} questions`);
  console.log(`Need updates: ${updates.length} questions\n`);

  if (updates.length === 0) {
    console.log('✅ No updates needed - all questions have framework tags!');
    return;
  }

  // 4. Show what will be updated
  console.log('Questions to update:');
  updates.slice(0, 10).forEach(u => {
    console.log(`  - ${u.text_preview}...`);
    console.log(`    Tags: ${u.framework_tags.filter(t => t.startsWith('mbti_') || t.startsWith('enneagram_')).join(', ')}`);
  });
  if (updates.length > 10) {
    console.log(`  ... and ${updates.length - 10} more`);
  }

  // 5. Perform updates (in batches)
  console.log('\n🔄 Updating database...');
  
  let successCount = 0;
  let errorCount = 0;

  for (const update of updates) {
    const { error } = await supabase
      .from('questions')
      .update({ framework_tags: update.framework_tags })
      .eq('id', update.id);

    if (error) {
      console.error(`  ❌ Error updating ${update.id}:`, error.message);
      errorCount++;
    } else {
      successCount++;
    }
  }

  console.log(`\n✅ Successfully updated: ${successCount} questions`);
  if (errorCount > 0) {
    console.log(`❌ Errors: ${errorCount} questions`);
  }

  // 6. Verify the update
  console.log('\n📊 Verifying update...');
  
  const { data: verifyData } = await supabase
    .from('questions')
    .select('framework_tags');

  const mbtiCount = verifyData.filter(q => 
    q.framework_tags?.some(t => t.startsWith('mbti_'))
  ).length;
  
  const enneagramCount = verifyData.filter(q => 
    q.framework_tags?.some(t => t.startsWith('enneagram_'))
  ).length;

  console.log(`  Questions with MBTI tags: ${mbtiCount}`);
  console.log(`  Questions with Enneagram tags: ${enneagramCount}`);

  console.log('\n' + '='.repeat(60));
  console.log('  SYNC COMPLETE');
  console.log('='.repeat(60) + '\n');
}

syncFrameworkTags().catch(console.error);

