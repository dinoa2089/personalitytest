/**
 * Trace exactly what the scoring algorithm does for J/P
 * Using the same logic as mock-scoring.ts
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

function getQuestionById(id) {
  return mockQuestions.find(q => q.id === id);
}

function scoreSimpleResponse(questionType, responseValue) {
  let actualValue = responseValue;
  if (typeof responseValue === "object" && responseValue !== null && "value" in responseValue) {
    actualValue = responseValue.value;
    if (typeof actualValue === "string") {
      try {
        const parsed = JSON.parse(actualValue);
        if (typeof parsed === "object" && parsed !== null) {
          actualValue = parsed;
        }
      } catch {}
    }
  }
  
  if (questionType === "likert") {
    if (typeof actualValue === "number") {
      return ((actualValue - 1) / 6) * 10;
    }
  }
  
  // Default
  return 5;
}

async function trace() {
  const sessionId = 'f57c1282-238d-463c-9416-b82aad5e1015';
  
  const { data: responses, error } = await supabase
    .from('assessment_responses')
    .select('question_id, response, question_type')
    .eq('session_id', sessionId);
  
  if (error) {
    console.error('Error fetching responses:', error);
    return;
  }
  
  if (!responses) {
    console.error('No responses found');
    return;
  }
  
  console.log('\n=== TRACING J/P SCORING (mock-scoring.ts logic) ===\n');
  console.log('Total responses:', responses.length);
  
  const mbtiScores = {
    mbti_ei: { totalScore: 0, totalWeight: 0, count: 0 },
    mbti_sn: { totalScore: 0, totalWeight: 0, count: 0 },
    mbti_tf: { totalScore: 0, totalWeight: 0, count: 0 },
    mbti_jp: { totalScore: 0, totalWeight: 0, count: 0 },
  };
  
  console.log('\n--- J/P Questions Processing ---\n');
  
  for (const response of responses) {
    const question = getQuestionById(response.question_id);
    
    if (!question) {
      // console.log('Question not found:', response.question_id);
      continue;
    }
    
    const frameworkTags = question.framework_tags || [];
    
    // Check for mbti_jp tag
    if (!frameworkTags.includes('mbti_jp')) {
      continue;
    }
    
    // Get discrimination from question
    let discrimination = question.discrimination || 1.0;
    
    let weight = question.weight || 1.0;
    const effectiveWeight = weight * discrimination;
    
    const isReversed = question.reverse_scored || false;
    
    // Score the response
    let mbtiScore = scoreSimpleResponse(response.question_type, response.response);
    const originalScore = mbtiScore;
    
    // Step 1: Apply PRISM normalization (reverse_scored)
    let normalizedScore = mbtiScore;
    if (isReversed) {
      normalizedScore = 10 - mbtiScore;
    }
    
    // Step 2: Apply MBTI dimension correction
    // For adaptability: high adaptability → P (low J), so invert for J scale
    let finalScore = normalizedScore;
    if (question.dimension === 'adaptability') {
      finalScore = 10 - normalizedScore;
    }
    // For conscientiousness: high conscientiousness → J, no additional inversion needed
    
    // Log this question's contribution
    const responseVal = typeof response.response === 'object' ? response.response.value : response.response;
    console.log('Q: ' + question.text.substring(0, 50) + '...');
    console.log('   Answer: ' + responseVal + ', Dimension: ' + question.dimension);
    console.log('   Base: ' + mbtiScore.toFixed(2) + ', Reversed: ' + isReversed + ' → Normalized: ' + normalizedScore.toFixed(2));
    console.log('   After J/P correction: ' + finalScore.toFixed(2) + ' (' + (finalScore > 5 ? 'J' : 'P') + ')');
    console.log('   Weight: ' + effectiveWeight.toFixed(2) + ', Contribution: ' + (finalScore * effectiveWeight).toFixed(2));
    console.log('');
    
    mbtiScore = finalScore;
    
    mbtiScores.mbti_jp.totalScore += mbtiScore * effectiveWeight;
    mbtiScores.mbti_jp.totalWeight += effectiveWeight;
    mbtiScores.mbti_jp.count += 1;
  }
  
  console.log('\n=== J/P FINAL CALCULATION ===\n');
  
  const data = mbtiScores.mbti_jp;
  console.log('Total Score:', data.totalScore.toFixed(2));
  console.log('Total Weight:', data.totalWeight.toFixed(2));
  console.log('Average (0-10):', (data.totalScore / data.totalWeight).toFixed(2));
  
  const normalizedScore = Math.max(0, Math.min(100, (data.totalScore / data.totalWeight) * 10));
  console.log('Normalized (0-100):', normalizedScore.toFixed(1));
  console.log('Question Count:', data.count);
  console.log('\nResult:', normalizedScore >= 50 ? 'JUDGING' : 'PERCEIVING');
  
  console.log('\n=== STORED RESULT COMPARISON ===');
  
  const { data: result } = await supabase
    .from('assessment_results')
    .select('framework_mappings')
    .eq('session_id', sessionId)
    .single();
  
  const storedJP = result.framework_mappings?.mbti?.dimensions?.['J/P'];
  console.log('\nStored J/P score:', storedJP?.score);
  console.log('Stored J/P letter:', storedJP?.value);
  console.log('\nDISCREPANCY:', (normalizedScore - storedJP?.score).toFixed(1), 'points');
}

trace().catch(console.error);

