/**
 * Question Selection Algorithm for PRISM-7
 * 
 * Guarantees coverage across dimensions while allowing randomization.
 * Uses a multi-phase approach:
 * 1. Satisfy minimum constraints (greedy)
 * 2. Fill remaining slots with weighted random selection
 * 3. Verify and adjust reverse-score ratio
 * 4. Shuffle final order
 */

import type { Question, Dimension, QuestionType } from '@/types';

export interface SelectionConstraints {
  totalQuestions: number;
  minPerPrismDimension: number;
  minPerQuestionType: number;
  minPerMbtiDimension: number;
  minPerEnneagramType: number;
  reverseScoreRatio: [number, number]; // [min, max] e.g., [0.3, 0.5]
}

export type AssessmentTier = 'quick' | 'standard' | 'comprehensive';

export const TIER_CONFIGS: Record<AssessmentTier, SelectionConstraints> = {
  quick: {
    totalQuestions: 35,
    minPerPrismDimension: 5,
    minPerQuestionType: 2,
    minPerMbtiDimension: 0,
    minPerEnneagramType: 0,
    reverseScoreRatio: [0.3, 0.5],
  },
  standard: {
    // 80 questions aligns with Checkpoint 3 (Enneagram unlock)
    totalQuestions: 80,
    minPerPrismDimension: 11,
    minPerQuestionType: 4,
    minPerMbtiDimension: 6,
    minPerEnneagramType: 2,
    reverseScoreRatio: [0.3, 0.5],
  },
  comprehensive: {
    totalQuestions: 105,
    minPerPrismDimension: 15,
    minPerQuestionType: 4,
    minPerMbtiDimension: 8,
    minPerEnneagramType: 3,
    reverseScoreRatio: [0.3, 0.5],
  },
};

export type RequestedFramework = 'prism' | 'mbti' | 'enneagram';

const PRISM_DIMENSIONS: Dimension[] = [
  'openness',
  'conscientiousness',
  'extraversion',
  'agreeableness',
  'emotionalResilience',
  'honestyHumility',
  'adaptability',
];

const QUESTION_TYPES: QuestionType[] = [
  'likert',
  'forced_choice',
  'situational_judgment',
  'behavioral_frequency',
];

const MBTI_DIMENSIONS = ['mbti_ei', 'mbti_sn', 'mbti_tf', 'mbti_jp'];

/**
 * Select a random subset of n items from an array
 */
function selectRandomN<T>(arr: T[], n: number): T[] {
  if (n >= arr.length) return [...arr];
  
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, n);
}

/**
 * Weighted random sampling based on discrimination parameter
 */
function weightedRandomSample(questions: Question[], n: number): Question[] {
  if (n >= questions.length) return [...questions];
  
  const weighted = questions.map(q => ({
    question: q,
    weight: (q.discrimination || 1.0) * (q.weight || 1.0),
  }));
  
  const selected: Question[] = [];
  const remaining = [...weighted];
  
  for (let i = 0; i < n && remaining.length > 0; i++) {
    const totalWeight = remaining.reduce((sum, w) => sum + w.weight, 0);
    let random = Math.random() * totalWeight;
    
    for (let j = 0; j < remaining.length; j++) {
      random -= remaining[j].weight;
      if (random <= 0) {
        selected.push(remaining[j].question);
        remaining.splice(j, 1);
        break;
      }
    }
  }
  
  return selected;
}

/**
 * Fisher-Yates shuffle
 */
function shuffle<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Main question selection function with coverage guarantees
 * 
 * Phases:
 * 0. Include all is_core questions first (guaranteed inclusion)
 * 1. Satisfy minimum coverage constraints per dimension/type
 * 2. Fill remaining slots with discrimination-weighted random selection
 * 3. Verify and adjust reverse-score ratio
 * 4. Deduplicate questions with same/similar text
 * 5. Shuffle final order
 */
export function selectQuestions(
  questionBank: Question[],
  tier: AssessmentTier,
  requestedFrameworks: RequestedFramework[] = ['prism']
): Question[] {
  const config = TIER_CONFIGS[tier];
  const selected: Question[] = [];
  const usedIds = new Set<string>();
  const usedTexts = new Set<string>(); // Track question texts to prevent duplicates
  
  // Normalize text for comparison (lowercase, trim, remove punctuation)
  const normalizeText = (text: string): string => {
    return text.toLowerCase().trim().replace(/[^\w\s]/g, '');
  };
  
  // Helper to add a question if not already selected and text is unique
  const addQuestion = (q: Question): boolean => {
    if (usedIds.has(q.id)) return false;
    
    const normalizedText = normalizeText(q.text);
    // Skip if we already have a question with the same text
    if (usedTexts.has(normalizedText)) {
      return false;
    }
    
    selected.push(q);
    usedIds.add(q.id);
    usedTexts.add(normalizedText);
    return true;
  };
  
  // Helper to get available questions matching criteria
  const getAvailable = (filter: (q: Question) => boolean): Question[] => {
    return questionBank.filter(q => !usedIds.has(q.id) && filter(q));
  };
  
  // =========================================
  // PHASE 0: Include all core questions first
  // Core questions are always included for reliability
  // =========================================
  const coreQuestions = questionBank.filter(q => q.is_core === true);
  
  // Sort core questions by discrimination (highest first) for optimal information
  const sortedCoreQuestions = [...coreQuestions].sort((a, b) => 
    (b.discrimination || 1.0) - (a.discrimination || 1.0)
  );
  
  // Add core questions up to a reasonable limit (don't exceed 60% of total)
  const maxCoreQuestions = Math.floor(config.totalQuestions * 0.6);
  for (const q of sortedCoreQuestions) {
    if (selected.length >= maxCoreQuestions) break;
    addQuestion(q);
  }
  
  // =========================================
  // PHASE 1: Satisfy minimum coverage constraints
  // =========================================
  
  // 1a. Ensure minimum per PRISM dimension
  for (const dim of PRISM_DIMENSIONS) {
    const dimQuestions = getAvailable(q => q.dimension === dim);
    const needed = config.minPerPrismDimension;
    const toSelect = selectRandomN(dimQuestions, needed);
    toSelect.forEach(addQuestion);
  }
  
  // 1b. Ensure minimum per question type
  for (const type of QUESTION_TYPES) {
    const currentCount = selected.filter(q => q.type === type).length;
    const needed = Math.max(0, config.minPerQuestionType - currentCount);
    
    if (needed > 0) {
      const typeQuestions = getAvailable(q => q.type === type);
      const toSelect = selectRandomN(typeQuestions, needed);
      toSelect.forEach(addQuestion);
    }
  }
  
  // 1c. Ensure MBTI coverage if requested
  if (requestedFrameworks.includes('mbti') && config.minPerMbtiDimension > 0) {
    for (const mbtiDim of MBTI_DIMENSIONS) {
      const mbtiQuestions = getAvailable(
        q => q.framework_tags?.includes(mbtiDim) ?? false
      );
      const toSelect = selectRandomN(mbtiQuestions, config.minPerMbtiDimension);
      toSelect.forEach(addQuestion);
    }
  }
  
  // 1d. Ensure Enneagram coverage if requested
  if (requestedFrameworks.includes('enneagram') && config.minPerEnneagramType > 0) {
    for (let type = 1; type <= 9; type++) {
      const enneagramQuestions = getAvailable(
        q => q.framework_tags?.includes(`enneagram_${type}`) ?? false
      );
      const toSelect = selectRandomN(enneagramQuestions, config.minPerEnneagramType);
      toSelect.forEach(addQuestion);
    }
  }
  
  // =========================================
  // PHASE 2: Fill remaining slots with weighted random selection
  // =========================================
  const remaining = config.totalQuestions - selected.length;
  
  if (remaining > 0) {
    const availableQuestions = getAvailable(() => true);
    
    // Weight by discrimination and ensure dimension balance
    const dimensionCounts = PRISM_DIMENSIONS.reduce((acc, dim) => {
      acc[dim] = selected.filter(q => q.dimension === dim).length;
      return acc;
    }, {} as Record<Dimension, number>);
    
    // Calculate max per dimension to ensure balance
    const maxPerDimension = Math.ceil(config.totalQuestions / PRISM_DIMENSIONS.length) + 2;
    
    // Filter out dimensions that are already at max
    const balancedAvailable = availableQuestions.filter(q => {
      const dimCount = dimensionCounts[q.dimension] || 0;
      return dimCount < maxPerDimension;
    });
    
    const weighted = weightedRandomSample(
      balancedAvailable.length > 0 ? balancedAvailable : availableQuestions,
      remaining
    );
    weighted.forEach(addQuestion);
  }
  
  // =========================================
  // PHASE 3: Verify reverse-score ratio and adjust if needed
  // =========================================
  const reverseCount = selected.filter(q => q.reverse_scored).length;
  const reverseRatio = reverseCount / selected.length;
  const [minRatio, maxRatio] = config.reverseScoreRatio;
  
  if (reverseRatio < minRatio) {
    // Need more reverse-scored questions
    const needed = Math.ceil(minRatio * selected.length) - reverseCount;
    const reverseAvailable = getAvailable(q => q.reverse_scored === true);
    
    if (reverseAvailable.length > 0 && needed > 0) {
      // Find non-reverse-scored questions we can swap
      const nonReverseInSelected = selected.filter(q => !q.reverse_scored);
      const toSwapCount = Math.min(needed, reverseAvailable.length, nonReverseInSelected.length);
      
      for (let i = 0; i < toSwapCount; i++) {
        // Find a candidate to swap out (prefer lower weight)
        const sortedNonReverse = nonReverseInSelected
          .filter(q => !reverseAvailable.some(r => r.dimension === q.dimension))
          .sort((a, b) => (a.weight || 1) - (b.weight || 1));
        
        if (sortedNonReverse.length > 0) {
          const toRemove = sortedNonReverse[i % sortedNonReverse.length];
          const toAdd = reverseAvailable.find(q => q.dimension === toRemove.dimension) || reverseAvailable[i];
          
          if (toAdd) {
            const idx = selected.indexOf(toRemove);
            if (idx > -1) {
              selected.splice(idx, 1);
              usedIds.delete(toRemove.id);
              addQuestion(toAdd);
            }
          }
        }
      }
    }
  }
  
  // =========================================
  // PHASE 4: Shuffle final order
  // =========================================
  return shuffle(selected);
}

/**
 * Get selection statistics for debugging/validation
 */
export function getSelectionStats(questions: Question[]): {
  total: number;
  byDimension: Record<string, number>;
  byType: Record<string, number>;
  reverseScoreRatio: number;
  avgWeight: number;
  avgDiscrimination: number;
  frameworkCoverage: Record<string, number>;
} {
  const byDimension: Record<string, number> = {};
  const byType: Record<string, number> = {};
  const frameworkCoverage: Record<string, number> = {};
  
  let reverseCount = 0;
  let totalWeight = 0;
  let totalDiscrimination = 0;
  
  for (const q of questions) {
    // Count by dimension
    byDimension[q.dimension] = (byDimension[q.dimension] || 0) + 1;
    
    // Count by type
    byType[q.type] = (byType[q.type] || 0) + 1;
    
    // Count reverse scored
    if (q.reverse_scored) reverseCount++;
    
    // Sum weights and discrimination
    totalWeight += q.weight || 1.0;
    totalDiscrimination += q.discrimination || 1.0;
    
    // Count framework tags
    if (q.framework_tags) {
      for (const tag of q.framework_tags) {
        frameworkCoverage[tag] = (frameworkCoverage[tag] || 0) + 1;
      }
    }
  }
  
  return {
    total: questions.length,
    byDimension,
    byType,
    reverseScoreRatio: questions.length > 0 ? reverseCount / questions.length : 0,
    avgWeight: questions.length > 0 ? totalWeight / questions.length : 0,
    avgDiscrimination: questions.length > 0 ? totalDiscrimination / questions.length : 0,
    frameworkCoverage,
  };
}

/**
 * Validate that a question set meets minimum requirements
 */
export function validateSelection(
  questions: Question[],
  tier: AssessmentTier
): { valid: boolean; issues: string[] } {
  const config = TIER_CONFIGS[tier];
  const stats = getSelectionStats(questions);
  const issues: string[] = [];
  
  // Check total count
  if (stats.total < config.totalQuestions * 0.9) {
    issues.push(`Total questions ${stats.total} is less than 90% of target ${config.totalQuestions}`);
  }
  
  // Check dimension coverage
  for (const dim of PRISM_DIMENSIONS) {
    const count = stats.byDimension[dim] || 0;
    if (count < config.minPerPrismDimension) {
      issues.push(`Dimension ${dim} has only ${count} questions, minimum is ${config.minPerPrismDimension}`);
    }
  }
  
  // Check question type diversity
  for (const type of QUESTION_TYPES) {
    const count = stats.byType[type] || 0;
    if (count < config.minPerQuestionType) {
      issues.push(`Question type ${type} has only ${count} questions, minimum is ${config.minPerQuestionType}`);
    }
  }
  
  // Check reverse score ratio
  const [minRatio, maxRatio] = config.reverseScoreRatio;
  if (stats.reverseScoreRatio < minRatio * 0.8) {
    issues.push(`Reverse score ratio ${(stats.reverseScoreRatio * 100).toFixed(1)}% is below minimum ${(minRatio * 100).toFixed(1)}%`);
  }
  if (stats.reverseScoreRatio > maxRatio * 1.2) {
    issues.push(`Reverse score ratio ${(stats.reverseScoreRatio * 100).toFixed(1)}% exceeds maximum ${(maxRatio * 100).toFixed(1)}%`);
  }
  
  return {
    valid: issues.length === 0,
    issues,
  };
}

/**
 * Select questions for a specific user, optionally excluding previously seen questions
 */
export function selectQuestionsForUser(
  questionBank: Question[],
  tier: AssessmentTier,
  requestedFrameworks: RequestedFramework[] = ['prism'],
  excludeQuestionIds: string[] = []
): Question[] {
  // Filter out previously seen questions
  const availableQuestions = questionBank.filter(
    q => !excludeQuestionIds.includes(q.id)
  );
  
  // If not enough questions remain, use full bank
  const config = TIER_CONFIGS[tier];
  if (availableQuestions.length < config.totalQuestions) {
    console.warn(
      `Only ${availableQuestions.length} unseen questions available, ` +
      `need ${config.totalQuestions}. Using full bank.`
    );
    return selectQuestions(questionBank, tier, requestedFrameworks);
  }
  
  return selectQuestions(availableQuestions, tier, requestedFrameworks);
}


