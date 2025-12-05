/**
 * Recalculate Dean's results using the corrected scoring algorithm
 */
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabaseUrl = 'https://eqkcmlxxuubibzoqliee.supabase.co';
const supabaseServiceKey = 'sb_secret_tCzyDalDHDI-iQqxGXx6Nw_qyb5kJej';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Load mock questions for metadata
const content = fs.readFileSync('lib/mock-questions.ts', 'utf8');
const arrayMatch = content.match(/export const mockQuestions[^=]*=\s*(\[[\s\S]*\]);?\s*$/);
let mockQuestions = [];
if (arrayMatch) {
  let jsonStr = arrayMatch[1].trim();
  if (jsonStr.endsWith(';')) jsonStr = jsonStr.slice(0, -1);
  mockQuestions = JSON.parse(jsonStr);
}

function getQuestionById(id) {
  return mockQuestions.find(q => q.id === id);
}

function scoreSimpleResponse(questionType, responseValue) {
  let actualValue = responseValue;
  if (typeof responseValue === "object" && responseValue !== null && "value" in responseValue) {
    actualValue = responseValue.value;
  }
  if (questionType === "likert" && typeof actualValue === "number") {
    return ((actualValue - 1) / 6) * 10;
  }
  return 5;
}

async function recalculate() {
  const sessionId = 'f57c1282-238d-463c-9416-b82aad5e1015';
  
  const { data: responses } = await supabase
    .from('assessment_responses')
    .select('question_id, response, question_type')
    .eq('session_id', sessionId);
  
  console.log('=== RECALCULATING DEAN\'S RESULTS ===\n');
  console.log('Using corrected scoring algorithm with dimension-aware corrections\n');
  
  // Initialize MBTI accumulators
  const mbtiScores = {
    mbti_ei: { totalScore: 0, totalWeight: 0, count: 0 },
    mbti_sn: { totalScore: 0, totalWeight: 0, count: 0 },
    mbti_tf: { totalScore: 0, totalWeight: 0, count: 0 },
    mbti_jp: { totalScore: 0, totalWeight: 0, count: 0 },
  };
  
  // Initialize Enneagram accumulators
  const enneagramScores = {};
  for (let i = 1; i <= 9; i++) {
    enneagramScores[`enneagram_${i}`] = { totalScore: 0, totalWeight: 0, count: 0 };
  }
  
  for (const response of responses) {
    const question = getQuestionById(response.question_id);
    if (!question) continue;
    
    const frameworkTags = question.framework_tags || [];
    const isReversed = question.reverse_scored || false;
    const prismDimension = question.dimension || '';
    const weight = (question.weight || 1) * (question.discrimination || 1);
    
    // Score MBTI dimensions
    for (const mbtiDim of ['mbti_ei', 'mbti_sn', 'mbti_tf', 'mbti_jp']) {
      if (!frameworkTags.includes(mbtiDim)) continue;
      
      let mbtiScore = scoreSimpleResponse(response.question_type, response.response);
      
      // Step 1: Apply PRISM normalization
      if (isReversed) {
        mbtiScore = 10 - mbtiScore;
      }
      
      // Step 2: Apply dimension-aware MBTI corrections
      if (mbtiDim === 'mbti_tf' && prismDimension === 'agreeableness') {
        mbtiScore = 10 - mbtiScore;
      }
      if (mbtiDim === 'mbti_sn' && prismDimension === 'openness') {
        mbtiScore = 10 - mbtiScore;
      }
      if (mbtiDim === 'mbti_jp' && prismDimension === 'adaptability') {
        mbtiScore = 10 - mbtiScore;
      }
      
      mbtiScores[mbtiDim].totalScore += mbtiScore * weight;
      mbtiScores[mbtiDim].totalWeight += weight;
      mbtiScores[mbtiDim].count += 1;
    }
    
    // Score Enneagram types
    for (let i = 1; i <= 9; i++) {
      const ennType = `enneagram_${i}`;
      if (!frameworkTags.includes(ennType)) continue;
      
      let ennScore = scoreSimpleResponse(response.question_type, response.response);
      
      // Apply reverse scoring with E3/E8 exception
      const lowAgreeablenessTypes = ['enneagram_3', 'enneagram_8'];
      const isLowAgreeablenessType = lowAgreeablenessTypes.includes(ennType);
      const isAgreeablenessDim = prismDimension === 'agreeableness';
      
      if (isReversed && !(isAgreeablenessDim && isLowAgreeablenessType)) {
        ennScore = 10 - ennScore;
      }
      
      enneagramScores[ennType].totalScore += ennScore * weight;
      enneagramScores[ennType].totalWeight += weight;
      enneagramScores[ennType].count += 1;
    }
  }
  
  // Calculate final MBTI scores
  console.log('=== MBTI RESULTS ===\n');
  
  const mbtiType = [];
  for (const [dim, data] of Object.entries(mbtiScores)) {
    if (data.totalWeight === 0) continue;
    
    const score = (data.totalScore / data.totalWeight) * 10;
    const letter1 = dim === 'mbti_ei' ? 'E' : dim === 'mbti_sn' ? 'S' : dim === 'mbti_tf' ? 'T' : 'J';
    const letter2 = dim === 'mbti_ei' ? 'I' : dim === 'mbti_sn' ? 'N' : dim === 'mbti_tf' ? 'F' : 'P';
    const result = score >= 50 ? letter1 : letter2;
    const confidence = Math.abs(score - 50) + 50;
    
    mbtiType.push(result);
    console.log(`${dim}: ${score.toFixed(1)} → ${result} (${data.count} questions, confidence: ${confidence.toFixed(0)}%)`);
  }
  
  console.log(`\n>>> MBTI TYPE: ${mbtiType.join('')} <<<`);
  
  // Calculate Enneagram results
  console.log('\n=== ENNEAGRAM RESULTS ===\n');
  
  const ennResults = [];
  for (const [ennType, data] of Object.entries(enneagramScores)) {
    if (data.totalWeight === 0) continue;
    
    const score = (data.totalScore / data.totalWeight) * 10;
    const typeNum = ennType.replace('enneagram_', '');
    ennResults.push({ type: typeNum, score, count: data.count });
  }
  
  // Sort by score descending
  ennResults.sort((a, b) => b.score - a.score);
  
  ennResults.forEach(r => {
    const bar = '█'.repeat(Math.round(r.score / 2));
    console.log(`Type ${r.type}: ${r.score.toFixed(1)} ${bar} (${r.count} questions)`);
  });
  
  console.log(`\n>>> PRIMARY ENNEAGRAM: Type ${ennResults[0]?.type} <<<`);
  
  // Compare to stored results
  console.log('\n=== COMPARISON TO STORED RESULTS ===\n');
  
  const { data: storedResult } = await supabase
    .from('assessment_results')
    .select('framework_mappings')
    .eq('session_id', sessionId)
    .single();
  
  const storedMbti = storedResult?.framework_mappings?.mbti?.type;
  const storedEnneagram = storedResult?.framework_mappings?.enneagram?.primary_type;
  
  console.log('Stored MBTI:', storedMbti);
  console.log('New MBTI:', mbtiType.join(''));
  console.log('');
  console.log('Stored Enneagram:', 'Type ' + storedEnneagram);
  console.log('New Enneagram:', 'Type ' + ennResults[0]?.type);
  console.log('');
  console.log('Your self-identified: ENTJ, Type 3');
}

recalculate().catch(console.error);

