#!/usr/bin/env node
/**
 * Analyze what each assessment length can reliably determine
 */

console.log('ASSESSMENT LENGTH ANALYSIS');
console.log('='.repeat(60));

// Assessment tiers and what they unlock
const tiers = {
  quick: { 
    questions: 35, 
    checkpoints: [1],
    frameworks: ['prism'],
    description: 'PRISM-7 only'
  },
  standard: { 
    questions: 80, 
    checkpoints: [1, 2, 3],
    frameworks: ['prism', 'mbti', 'enneagram'],
    description: 'PRISM-7 + MBTI + Enneagram'
  },
  full: { 
    questions: 105, 
    checkpoints: [1, 2, 3, 4],
    frameworks: ['prism', 'mbti', 'enneagram', 'detailed'],
    description: 'Full comprehensive'
  }
};

// Minimum questions needed for reliable assessment
const minimums = {
  prism: {
    perDimension: 5,
    dimensions: 7,
    total: 35,
    confident: 8  // For high confidence
  },
  mbti: {
    perDimension: 4,
    dimensions: 4,
    total: 16,
    confident: 6  // For high confidence
  },
  enneagram: {
    perType: 2,
    types: 9,
    total: 18,
    confident: 4  // For high confidence
  }
};

// Question distribution by checkpoint
const checkpointQuestions = {
  1: { start: 1, end: 35, count: 35, focus: 'prism' },
  2: { start: 36, end: 55, count: 20, focus: 'mbti' },
  3: { start: 56, end: 80, count: 25, focus: 'enneagram' },
  4: { start: 81, end: 105, count: 25, focus: 'refinement' }
};

console.log('\nCHECKPOINT STRUCTURE:');
Object.entries(checkpointQuestions).forEach(([cp, info]) => {
  console.log(`  Checkpoint ${cp}: Questions ${info.start}-${info.end} (${info.count} questions) - Focus: ${info.focus}`);
});

console.log('\n' + '='.repeat(60));

Object.entries(tiers).forEach(([tierName, tier]) => {
  console.log(`\n[${tierName.toUpperCase()}] - ${tier.questions} questions`);
  console.log(`Description: ${tier.description}`);
  console.log('');
  
  // Calculate available questions per framework
  let prismQuestions = 35; // Always get checkpoint 1
  let mbtiQuestions = tier.questions >= 55 ? 20 : 0;
  let enneagramQuestions = tier.questions >= 80 ? 25 : 0;
  let refinementQuestions = tier.questions >= 105 ? 25 : 0;
  
  console.log('Question allocation:');
  console.log(`  - PRISM-7: ${prismQuestions} questions (${(prismQuestions/7).toFixed(1)} per dimension)`);
  if (mbtiQuestions > 0) {
    console.log(`  - MBTI: ${mbtiQuestions} questions (${(mbtiQuestions/4).toFixed(1)} per dimension)`);
  }
  if (enneagramQuestions > 0) {
    console.log(`  - Enneagram: ${enneagramQuestions} questions (${(enneagramQuestions/9).toFixed(1)} per type)`);
  }
  if (refinementQuestions > 0) {
    console.log(`  - Refinement: ${refinementQuestions} questions`);
  }
  
  console.log('');
  console.log('Assessment reliability:');
  
  // PRISM-7
  const prismPerDim = prismQuestions / 7;
  const prismReliable = prismPerDim >= minimums.prism.perDimension;
  const prismConfident = prismPerDim >= minimums.prism.confident;
  console.log(`  - PRISM-7: ${prismConfident ? 'HIGH CONFIDENCE' : (prismReliable ? 'RELIABLE' : 'INSUFFICIENT')}`);
  
  // MBTI
  if (tier.frameworks.includes('mbti')) {
    const mbtiPerDim = mbtiQuestions / 4;
    // Cross-framework inference adds ~2 effective questions per dimension from PRISM
    const effectiveMbtiPerDim = mbtiPerDim + 2;
    const mbtiReliable = effectiveMbtiPerDim >= minimums.mbti.perDimension;
    const mbtiConfident = effectiveMbtiPerDim >= minimums.mbti.confident;
    
    if (mbtiQuestions === 0) {
      console.log(`  - MBTI: NOT AVAILABLE (need checkpoint 2)`);
    } else {
      console.log(`  - MBTI: ${mbtiConfident ? 'HIGH CONFIDENCE' : (mbtiReliable ? 'RELIABLE' : 'PRELIMINARY')} (${mbtiPerDim} direct + inference)`);
    }
  } else {
    console.log(`  - MBTI: NOT INCLUDED in this tier`);
  }
  
  // Enneagram
  if (tier.frameworks.includes('enneagram')) {
    const ennPerType = enneagramQuestions / 9;
    // Cross-framework inference adds ~1 effective question per type from PRISM
    const effectiveEnnPerType = ennPerType + 1;
    const ennReliable = effectiveEnnPerType >= minimums.enneagram.perType;
    const ennConfident = effectiveEnnPerType >= minimums.enneagram.confident;
    
    if (enneagramQuestions === 0) {
      console.log(`  - Enneagram: NOT AVAILABLE (need checkpoint 3)`);
    } else {
      console.log(`  - Enneagram: ${ennConfident ? 'HIGH CONFIDENCE' : (ennReliable ? 'RELIABLE' : 'PRELIMINARY')} (${ennPerType.toFixed(1)} direct + inference)`);
    }
  } else {
    console.log(`  - Enneagram: NOT INCLUDED in this tier`);
  }
});

console.log('\n' + '='.repeat(60));
console.log('IMPLEMENTATION RECOMMENDATIONS:');
console.log('='.repeat(60));

console.log(`
1. QUICK ASSESSMENT (35 questions):
   - Show: PRISM-7 results only
   - Hide: MBTI and Enneagram sections completely
   - CTA: "Unlock MBTI type - continue to checkpoint 2"

2. STANDARD ASSESSMENT (80 questions):
   - Show: PRISM-7 with high confidence
   - Show: MBTI with confidence indicator
   - Show: Enneagram with confidence indicator  
   - If confidence < threshold, show: "Complete more questions for higher accuracy"

3. FULL ASSESSMENT (105 questions):
   - Show: All frameworks with high confidence
   - Show: Detailed facet-level analysis
   - Show: Full compatibility and career insights

4. ADAPTIVE LOGIC NEEDED:
   - Track confidence per framework based on questions answered
   - Only show results when confidence >= minimum threshold
   - Offer to continue assessment to improve low-confidence areas
`);


