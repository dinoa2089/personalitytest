/**
 * Debug script to identify scoring mismatch between database and mock file
 */
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

// Hardcoded for debugging (remove after use)
const supabaseUrl = 'https://eqkcmlxxuubibzoqliee.supabase.co';
const supabaseServiceKey = 'sb_secret_tCzyDalDHDI-iQqxGXx6Nw_qyb5kJej';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Read mock file and extract all question IDs
const content = fs.readFileSync('lib/mock-questions.ts', 'utf8');
const idRegex = /"id":\s*"([^"]+)"/g;
const mockIds = new Set();
let match;
while ((match = idRegex.exec(content)) !== null) {
  mockIds.add(match[1]);
}

console.log('\n=== SCORING DATA SOURCE ANALYSIS ===\n');
console.log('Question IDs in mock-questions.ts:', mockIds.size);

async function analyze() {
  const sessionId = 'f57c1282-238d-463c-9416-b82aad5e1015';
  
  // Get session responses
  const { data: responses } = await supabase
    .from('assessment_responses')
    .select('question_id')
    .eq('session_id', sessionId);
  
  const sessionQuestionIds = responses.map(r => r.question_id);
  console.log('Questions in your assessment:', sessionQuestionIds.length);
  
  // Check how many are in mock file
  let foundInMock = 0;
  let missingFromMock = [];
  
  sessionQuestionIds.forEach(id => {
    if (mockIds.has(id)) {
      foundInMock++;
    } else {
      missingFromMock.push(id);
    }
  });
  
  console.log('\nQuestions found in mock file:', foundInMock);
  console.log('Questions MISSING from mock file:', missingFromMock.length);
  
  if (missingFromMock.length > 0) {
    // Get details of missing questions
    const { data: missingQs } = await supabase
      .from('questions')
      .select('id, text, framework_tags')
      .in('id', missingFromMock);
    
    console.log('\n=== MISSING QUESTIONS ===');
    missingQs.forEach(q => {
      const hasJP = q.framework_tags?.includes('mbti_jp');
      const marker = hasJP ? '🔴 [mbti_jp]' : '';
      console.log(marker + ' ' + q.text.substring(0, 60) + '...');
    });
    
    const missingJP = missingQs.filter(q => q.framework_tags?.includes('mbti_jp'));
    console.log('\n⚠️  Missing questions with mbti_jp tag:', missingJP.length);
    
    if (missingJP.length > 0) {
      console.log('\n🐛 BUG CONFIRMED: Scoring algorithm cannot find these J/P questions!');
      console.log('   They exist in database but not in mock-questions.ts');
      console.log('   This causes incorrect J/P scoring.');
    }
  }
  
  // Now let's check for data mismatches in questions that DO exist in both
  console.log('\n=== CHECKING DATA MISMATCHES ===');
  
  const { data: dbQuestions } = await supabase
    .from('questions')
    .select('id, text, framework_tags, reverse_scored')
    .in('id', sessionQuestionIds);
  
  // Parse the actual mock questions array
  const arrayMatch = content.match(/export const mockQuestions[^=]*=\s*(\[[\s\S]*\]);?\s*$/);
  let mockQuestions = [];
  if (arrayMatch) {
    try {
      let jsonStr = arrayMatch[1].trim();
      if (jsonStr.endsWith(';')) jsonStr = jsonStr.slice(0, -1);
      mockQuestions = JSON.parse(jsonStr);
    } catch (e) {
      console.log('Could not parse mock questions array');
    }
  }
  
  if (mockQuestions.length > 0) {
    let tagMismatches = 0;
    let reverseMismatches = 0;
    
    dbQuestions.forEach(dbQ => {
      const mockQ = mockQuestions.find(m => m.id === dbQ.id);
      if (!mockQ) return;
      
      // Check if mbti_jp presence matches
      const dbHasJP = dbQ.framework_tags?.includes('mbti_jp') || false;
      const mockHasJP = mockQ.framework_tags?.includes('mbti_jp') || false;
      
      if (dbHasJP !== mockHasJP) {
        tagMismatches++;
        console.log('\n⚠️  mbti_jp TAG MISMATCH:');
        console.log('   ' + dbQ.text.substring(0, 50) + '...');
        console.log('   Database: ' + dbHasJP + ', Mock: ' + mockHasJP);
      }
      
      // Check reverse_scored
      const dbReverse = dbQ.reverse_scored || false;
      const mockReverse = mockQ.reverse_scored || false;
      
      if (dbHasJP && dbReverse !== mockReverse) {
        reverseMismatches++;
        console.log('\n⚠️  REVERSE_SCORED MISMATCH (J/P question):');
        console.log('   ' + dbQ.text.substring(0, 50) + '...');
        console.log('   Database: ' + dbReverse + ', Mock: ' + mockReverse);
      }
    });
    
    console.log('\n=== MISMATCH SUMMARY ===');
    console.log('mbti_jp tag mismatches:', tagMismatches);
    console.log('reverse_scored mismatches (J/P questions):', reverseMismatches);
  }
}

analyze().catch(console.error);

