/**
 * Adaptive Question Selection System
 * 
 * Implements IRT-based adaptive testing that:
 * 1. Tracks current trait estimates for PRISM-7, MBTI, and Enneagram
 * 2. Calculates uncertainty (standard error) for each dimension/type
 * 3. Selects questions that maximize information gain for the current checkpoint's framework
 * 4. Prevents duplicate/similar questions from being asked
 * 5. Leverages cross-framework mappings (e.g., extraversion maps to MBTI E/I)
 * 
 * Checkpoint Structure:
 * - Checkpoint 1 (Q1-35): PRISM-7 core dimensions
 * - Checkpoint 2 (Q36-55): MBTI dimensions (with PRISM knowledge carried over)
 * - Checkpoint 3 (Q56-80): Enneagram types (with PRISM + MBTI knowledge)
 * - Checkpoint 4 (Q81-105): Deep dive refinement
 */

import type { Question, QuestionResponse, Dimension } from '@/types';

// ============================================
// FRAMEWORK DEFINITIONS
// ============================================

// PRISM-7 Dimensions (primary framework)
const PRISM_DIMENSIONS: Dimension[] = [
  'openness',
  'conscientiousness', 
  'extraversion',
  'agreeableness',
  'emotionalResilience',
  'honestyHumility',
  'adaptability',
];

// MBTI Dimensions (unlocked at checkpoint 2)
const MBTI_DIMENSIONS = ['mbti_ei', 'mbti_sn', 'mbti_tf', 'mbti_jp'] as const;
type MbtiDimension = typeof MBTI_DIMENSIONS[number];

// Enneagram Types (unlocked at checkpoint 3)
const ENNEAGRAM_TYPES = ['enneagram_1', 'enneagram_2', 'enneagram_3', 'enneagram_4', 
                         'enneagram_5', 'enneagram_6', 'enneagram_7', 'enneagram_8', 
                         'enneagram_9'] as const;
type EnneagramType = typeof ENNEAGRAM_TYPES[number];

// Cross-framework mappings: PRISM dimensions that inform other frameworks
const PRISM_TO_MBTI_MAPPING: Record<Dimension, MbtiDimension[]> = {
  openness: ['mbti_sn'],           // Openness relates to Intuition vs Sensing
  conscientiousness: ['mbti_jp'],  // Conscientiousness relates to Judging vs Perceiving
  extraversion: ['mbti_ei'],       // Direct mapping
  agreeableness: ['mbti_tf'],      // Agreeableness relates to Feeling vs Thinking
  emotionalResilience: [],         // No direct MBTI mapping
  honestyHumility: [],             // No direct MBTI mapping
  adaptability: ['mbti_jp'],       // Adaptability relates to Perceiving
};

const PRISM_TO_ENNEAGRAM_MAPPING: Record<Dimension, EnneagramType[]> = {
  openness: ['enneagram_4', 'enneagram_5', 'enneagram_7'],
  conscientiousness: ['enneagram_1', 'enneagram_3', 'enneagram_6'],
  extraversion: ['enneagram_2', 'enneagram_3', 'enneagram_7', 'enneagram_8'],
  agreeableness: ['enneagram_2', 'enneagram_9'],
  emotionalResilience: ['enneagram_4', 'enneagram_6'],
  honestyHumility: ['enneagram_1', 'enneagram_2'],
  adaptability: ['enneagram_7', 'enneagram_9'],
};

// Checkpoint framework focus
type CheckpointFramework = 'prism' | 'mbti' | 'enneagram' | 'detailed';

const CHECKPOINT_CONFIG: Record<number, {
  frameworks: CheckpointFramework[];
  questionRange: [number, number];
  minPerPrismDimension: number;
  minPerMbtiDimension: number;
  minPerEnneagramType: number;
}> = {
  // Checkpoint 1: Focus on PRISM-7 core dimensions (35 questions)
  1: { frameworks: ['prism'], questionRange: [0, 35], minPerPrismDimension: 5, minPerMbtiDimension: 0, minPerEnneagramType: 0 },
  // Checkpoint 2: Add MBTI focus - need at least 5 questions per MBTI dimension (20 total MBTI questions)
  // We have 10 questions per dimension, so 5 is achievable and gives good accuracy
  2: { frameworks: ['prism', 'mbti'], questionRange: [35, 55], minPerPrismDimension: 0, minPerMbtiDimension: 5, minPerEnneagramType: 0 },
  // Checkpoint 3: Add Enneagram focus - need at least 4 questions per type (36 total Enneagram questions)
  // We now have 9-13 questions per type, so 4 per type is achievable and improves accuracy
  3: { frameworks: ['prism', 'mbti', 'enneagram'], questionRange: [55, 80], minPerPrismDimension: 0, minPerMbtiDimension: 0, minPerEnneagramType: 4 },
  // Checkpoint 4: Deep dive - catch up on any missed framework questions + refine uncertain areas
  // Increase minimums to ensure the new questions get used for better coverage
  4: { frameworks: ['prism', 'mbti', 'enneagram', 'detailed'], questionRange: [80, 105], minPerPrismDimension: 0, minPerMbtiDimension: 2, minPerEnneagramType: 2 },
};

// Question type weights (from methodology)
const TYPE_WEIGHTS: Record<string, number> = {
  behavioral_frequency: 1.5,
  situational_judgment: 1.3,
  forced_choice: 1.2,
  likert: 1.0,
};

/**
 * Trait estimate for a single dimension/type
 */
export interface TraitEstimate {
  id: string;              // Dimension or type identifier
  estimate: number;        // Current trait estimate (0-100 scale)
  standardError: number;   // Uncertainty in the estimate
  responseCount: number;   // Number of questions answered for this dimension
  sumWeights: number;      // Sum of effective weights for precision calculation
  inferredFrom?: string[]; // If estimated from cross-framework mapping
}

/**
 * Multi-framework adaptive state that persists across the assessment
 */
export interface AdaptiveState {
  // PRISM-7 estimates (primary)
  prismEstimates: Record<Dimension, TraitEstimate>;
  // MBTI estimates (unlocked at checkpoint 2)
  mbtiEstimates: Record<string, TraitEstimate>;
  // Enneagram estimates (unlocked at checkpoint 3)
  enneagramEstimates: Record<string, TraitEstimate>;
  // Tracking
  answeredQuestionIds: Set<string>;
  answeredQuestionTexts: Set<string>;  // Normalized texts to prevent duplicates
  currentCheckpoint: number;
  questionsAnswered: number;
  // Question type variety tracking - stores last N question types
  recentQuestionTypes: string[];
}

// Maximum consecutive questions of the same type before applying penalty
const MAX_CONSECUTIVE_SAME_TYPE = 2;
// How many recent questions to track for type variety
const RECENT_TYPES_WINDOW = 5;

/**
 * Initialize adaptive state at the start of an assessment
 */
export function initializeAdaptiveState(): AdaptiveState {
  // Initialize PRISM-7 estimates
  const prismEstimates: Record<string, TraitEstimate> = {};
  for (const dim of PRISM_DIMENSIONS) {
    prismEstimates[dim] = {
      id: dim,
      estimate: 50,          // Start at population mean
      standardError: 25,     // High initial uncertainty
      responseCount: 0,
      sumWeights: 0,
    };
  }
  
  // Initialize MBTI estimates (will be refined at checkpoint 2)
  const mbtiEstimates: Record<string, TraitEstimate> = {};
  for (const dim of MBTI_DIMENSIONS) {
    mbtiEstimates[dim] = {
      id: dim,
      estimate: 50,
      standardError: 25,
      responseCount: 0,
      sumWeights: 0,
      inferredFrom: [], // Will be populated from PRISM mappings
    };
  }
  
  // Initialize Enneagram estimates (will be refined at checkpoint 3)
  const enneagramEstimates: Record<string, TraitEstimate> = {};
  for (const type of ENNEAGRAM_TYPES) {
    enneagramEstimates[type] = {
      id: type,
      estimate: 50,
      standardError: 25,
      responseCount: 0,
      sumWeights: 0,
      inferredFrom: [],
    };
  }
  
  return {
    prismEstimates: prismEstimates as Record<Dimension, TraitEstimate>,
    mbtiEstimates,
    enneagramEstimates,
    answeredQuestionIds: new Set(),
    answeredQuestionTexts: new Set(),
    currentCheckpoint: 1,
    questionsAnswered: 0,
    recentQuestionTypes: [],
  };
}

/**
 * Update MBTI estimates based on PRISM scores (cross-framework inference)
 */
function inferMbtiFromPrism(state: AdaptiveState): void {
  for (const mbtiDim of MBTI_DIMENSIONS) {
    // Find PRISM dimensions that map to this MBTI dimension
    const inferredFrom: string[] = [];
    let totalEstimate = 0;
    let totalWeight = 0;
    
    for (const [prismDim, mbtiDims] of Object.entries(PRISM_TO_MBTI_MAPPING)) {
      if (mbtiDims.includes(mbtiDim)) {
        const prismEstimate = state.prismEstimates[prismDim as Dimension];
        if (prismEstimate && prismEstimate.responseCount > 0) {
          // Weight by certainty (inverse of SE)
          const weight = 1 / (prismEstimate.standardError + 1);
          totalEstimate += prismEstimate.estimate * weight;
          totalWeight += weight;
          inferredFrom.push(prismDim);
        }
      }
    }
    
    if (totalWeight > 0 && state.mbtiEstimates[mbtiDim].responseCount === 0) {
      // Only use inference if we don't have direct responses
      state.mbtiEstimates[mbtiDim].estimate = totalEstimate / totalWeight;
      state.mbtiEstimates[mbtiDim].standardError = Math.max(15, 25 - inferredFrom.length * 3);
      state.mbtiEstimates[mbtiDim].inferredFrom = inferredFrom;
    }
  }
}

/**
 * Update Enneagram estimates based on PRISM scores (cross-framework inference)
 */
function inferEnneagramFromPrism(state: AdaptiveState): void {
  for (const ennType of ENNEAGRAM_TYPES) {
    const inferredFrom: string[] = [];
    let scores: number[] = [];
    
    for (const [prismDim, ennTypes] of Object.entries(PRISM_TO_ENNEAGRAM_MAPPING)) {
      if (ennTypes.includes(ennType)) {
        const prismEstimate = state.prismEstimates[prismDim as Dimension];
        if (prismEstimate && prismEstimate.responseCount > 0) {
          scores.push(prismEstimate.estimate);
          inferredFrom.push(prismDim);
        }
      }
    }
    
    if (scores.length > 0 && state.enneagramEstimates[ennType].responseCount === 0) {
      // Average the contributing PRISM scores
      const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
      state.enneagramEstimates[ennType].estimate = avgScore;
      state.enneagramEstimates[ennType].standardError = Math.max(15, 25 - inferredFrom.length * 2);
      state.enneagramEstimates[ennType].inferredFrom = inferredFrom;
    }
  }
}

/**
 * Normalize text for duplicate detection
 */
function normalizeText(text: string): string {
  return text.toLowerCase().trim().replace(/[^\w\s]/g, '').replace(/\s+/g, ' ');
}

/**
 * Calculate penalty for question type based on recent history
 * Returns a multiplier (0.1-1.0) - lower means more penalty
 */
function calculateTypeVarietyMultiplier(
  questionType: string,
  recentTypes: string[]
): number {
  if (recentTypes.length === 0) return 1.0;
  
  // Count consecutive same types from the end
  let consecutiveCount = 0;
  for (let i = recentTypes.length - 1; i >= 0; i--) {
    if (recentTypes[i] === questionType) {
      consecutiveCount++;
    } else {
      break;
    }
  }
  
  // If we've had MAX_CONSECUTIVE_SAME_TYPE or more of this type in a row,
  // heavily penalize selecting another one
  if (consecutiveCount >= MAX_CONSECUTIVE_SAME_TYPE) {
    return 0.1; // 90% penalty
  }
  
  // Lighter penalty for 1 consecutive
  if (consecutiveCount === 1) {
    return 0.6; // 40% penalty
  }
  
  // Also check overall frequency in recent window
  const sameTypeCount = recentTypes.filter(t => t === questionType).length;
  const frequencyRatio = sameTypeCount / recentTypes.length;
  
  // If this type makes up more than 60% of recent questions, apply penalty
  if (frequencyRatio > 0.6) {
    return 0.5;
  }
  
  return 1.0;
}

/**
 * Calculate information value of a question at current trait estimate
 * Higher discrimination + closer to current estimate = more information
 */
function calculateInformationValue(
  question: Question,
  currentEstimate: number,
  discrimination: number
): number {
  // IRT 2PL information function approximation
  // I(θ) = a² * P(θ) * Q(θ) where P is probability of high response
  // Simplified: information is highest when estimate is near question difficulty
  
  const difficulty = question.difficulty ?? 0.5;
  const difficultyOnScale = difficulty * 100;
  
  // Distance from current estimate (normalized)
  const distance = Math.abs(currentEstimate - difficultyOnScale) / 100;
  
  // Information decreases with distance from current estimate
  const proximityFactor = Math.exp(-2 * distance * distance);
  
  // Information increases with discrimination
  const discriminationSquared = discrimination * discrimination;
  
  return discriminationSquared * proximityFactor;
}

/**
 * Get the most uncertain dimension/type for the current checkpoint's framework
 */
export function getMostUncertainForCheckpoint(
  state: AdaptiveState,
  checkpoint: number
): { type: 'prism' | 'mbti' | 'enneagram'; id: string; uncertainty: number } {
  const config = CHECKPOINT_CONFIG[checkpoint] || CHECKPOINT_CONFIG[1];
  let maxUncertainty = -1;
  let mostUncertain: { type: 'prism' | 'mbti' | 'enneagram'; id: string; uncertainty: number } = { type: 'prism', id: 'openness', uncertainty: 0 };
  
  // Always check PRISM dimensions first (they inform everything)
  for (const dim of PRISM_DIMENSIONS) {
    const estimate = state.prismEstimates[dim];
    const uncertainty = estimate.standardError * (1 + 1 / (estimate.responseCount + 1));
    
    if (uncertainty > maxUncertainty) {
      maxUncertainty = uncertainty;
      mostUncertain = { type: 'prism', id: dim, uncertainty };
    }
  }
  
  // Check MBTI if we're at checkpoint 2+
  if (config.frameworks.includes('mbti')) {
    for (const dim of MBTI_DIMENSIONS) {
      const estimate = state.mbtiEstimates[dim];
      // Give MBTI a boost if it's the focus of this checkpoint
      const focusBoost = checkpoint === 2 ? 1.5 : 1.0;
      const uncertainty = estimate.standardError * (1 + 1 / (estimate.responseCount + 1)) * focusBoost;
      
      if (uncertainty > maxUncertainty) {
        maxUncertainty = uncertainty;
        mostUncertain = { type: 'mbti', id: dim, uncertainty };
      }
    }
  }
  
  // Check Enneagram if we're at checkpoint 3+
  if (config.frameworks.includes('enneagram')) {
    for (const type of ENNEAGRAM_TYPES) {
      const estimate = state.enneagramEstimates[type];
      // Give Enneagram a boost if it's the focus of this checkpoint
      const focusBoost = checkpoint === 3 ? 1.5 : 1.0;
      const uncertainty = estimate.standardError * (1 + 1 / (estimate.responseCount + 1)) * focusBoost;
      
      if (uncertainty > maxUncertainty) {
        maxUncertainty = uncertainty;
        mostUncertain = { type: 'enneagram', id: type, uncertainty };
      }
    }
  }
  
  return mostUncertain;
}

/**
 * Get dimensions/types that still need coverage for the current checkpoint
 */
export function getFrameworksNeedingCoverage(
  state: AdaptiveState,
  checkpoint: number
): Array<{ type: 'prism' | 'mbti' | 'enneagram'; id: string; needed: number }> {
  const config = CHECKPOINT_CONFIG[checkpoint] || CHECKPOINT_CONFIG[1];
  const needsCoverage: Array<{ type: 'prism' | 'mbti' | 'enneagram'; id: string; needed: number }> = [];
  
  // Check PRISM coverage
  if (config.minPerPrismDimension > 0) {
    for (const dim of PRISM_DIMENSIONS) {
      const count = state.prismEstimates[dim].responseCount;
      if (count < config.minPerPrismDimension) {
        needsCoverage.push({ type: 'prism', id: dim, needed: config.minPerPrismDimension - count });
      }
    }
  }
  
  // Check MBTI coverage
  if (config.minPerMbtiDimension > 0) {
    for (const dim of MBTI_DIMENSIONS) {
      const count = state.mbtiEstimates[dim].responseCount;
      if (count < config.minPerMbtiDimension) {
        needsCoverage.push({ type: 'mbti', id: dim, needed: config.minPerMbtiDimension - count });
      }
    }
  }
  
  // Check Enneagram coverage
  if (config.minPerEnneagramType > 0) {
    for (const type of ENNEAGRAM_TYPES) {
      const count = state.enneagramEstimates[type].responseCount;
      if (count < config.minPerEnneagramType) {
        needsCoverage.push({ type: 'enneagram', id: type, needed: config.minPerEnneagramType - count });
      }
    }
  }
  
  // Sort by most needed first
  return needsCoverage.sort((a, b) => b.needed - a.needed);
}

/**
 * Check if a question contributes to a specific framework target
 */
function questionMatchesTarget(
  question: Question,
  target: { type: 'prism' | 'mbti' | 'enneagram'; id: string }
): boolean {
  const tags = question.framework_tags || [];
  
  if (target.type === 'prism') {
    // Check primary dimension or framework tags
    return question.dimension === target.id || 
           tags.includes(`prism_${target.id}`);
  } else if (target.type === 'mbti') {
    return tags.includes(target.id);
  } else if (target.type === 'enneagram') {
    return tags.includes(target.id);
  }
  
  return false;
}

/**
 * Calculate question relevance for current checkpoint
 * Prioritizes framework-tagged questions that directly measure MBTI/Enneagram
 */
function calculateCheckpointRelevance(
  question: Question,
  state: AdaptiveState,
  checkpoint: number
): number {
  const config = CHECKPOINT_CONFIG[checkpoint] || CHECKPOINT_CONFIG[1];
  const tags = question.framework_tags || [];
  let relevance = 1.0;
  
  // Check which framework tags this question has
  const hasMbtiTag = MBTI_DIMENSIONS.some(dim => tags.includes(dim));
  const mbtiTagsPresent = MBTI_DIMENSIONS.filter(dim => tags.includes(dim));
  const hasEnneagramTag = ENNEAGRAM_TYPES.some(type => tags.includes(type));
  const enneagramTagsPresent = ENNEAGRAM_TYPES.filter(type => tags.includes(type));
  
  // Boost questions that target the checkpoint's focus frameworks
  if (checkpoint === 1) {
    // Focus on PRISM - but also value dual-purpose questions that establish MBTI baseline
    relevance *= 1.5;
    
    // Extra boost for PRISM dimensions that have low response counts
    const prismEstimate = state.prismEstimates[question.dimension];
    if (prismEstimate && prismEstimate.responseCount < 5) {
      relevance *= 1.5; // Prioritize under-sampled dimensions
    }
    
    // Slight boost for questions that also contribute to MBTI (getting ahead)
    if (hasMbtiTag) {
      relevance *= 1.2;
    }
  } else if (checkpoint === 2) {
    // Focus on MBTI - strongly boost questions with MBTI tags
    if (hasMbtiTag) {
      // Higher boost (3x) for direct MBTI questions
      relevance *= 3.0;
      
      // Extra boost for MBTI dimensions that have low response counts
      for (const mbtiDim of mbtiTagsPresent) {
        const estimate = state.mbtiEstimates[mbtiDim];
        if (estimate && estimate.responseCount < 5) {
          relevance *= 1.5; // Prioritize under-sampled dimensions
        }
        // Special boost for S/N dimension which tends to have fewer questions
        if (mbtiDim === 'mbti_sn' && estimate && estimate.responseCount < 6) {
          relevance *= 1.3; // Additional boost for S/N coverage
        }
      }
    }
    // Also boost questions whose PRISM dimension maps to uncertain MBTI
    for (const [prismDim, mbtiDims] of Object.entries(PRISM_TO_MBTI_MAPPING)) {
      if (question.dimension === prismDim) {
        for (const mbtiDim of mbtiDims) {
          const mbtiEstimate = state.mbtiEstimates[mbtiDim];
          if (mbtiEstimate && mbtiEstimate.standardError > 15) {
            relevance *= 1.3;
          }
        }
      }
    }
    
    // Continue boosting under-sampled PRISM dimensions
    const prismEstimate = state.prismEstimates[question.dimension];
    if (prismEstimate && prismEstimate.responseCount < 6) {
      relevance *= 1.3; // Keep building PRISM coverage
    }
  } else if (checkpoint === 3) {
    // Focus on Enneagram - strongly boost questions with Enneagram tags
    if (hasEnneagramTag) {
      // Higher boost (3x) for direct Enneagram questions
      relevance *= 3.0;
      
      // Extra boost for Enneagram types that have low response counts
      // With 9-13 questions per type now available, we can be more aggressive about coverage
      for (const ennType of enneagramTagsPresent) {
        const estimate = state.enneagramEstimates[ennType];
        if (estimate && estimate.responseCount < 4) {
          relevance *= 1.5; // Prioritize under-sampled types
        }
      }
    }
    // Also boost questions whose PRISM dimension maps to uncertain Enneagram
    for (const [prismDim, ennTypes] of Object.entries(PRISM_TO_ENNEAGRAM_MAPPING)) {
      if (question.dimension === prismDim) {
        for (const ennType of ennTypes) {
          const ennEstimate = state.enneagramEstimates[ennType];
          if (ennEstimate && ennEstimate.standardError > 15) {
            relevance *= 1.2;
          }
        }
      }
    }
    
    // Continue boosting under-sampled PRISM dimensions
    const prismEstimate = state.prismEstimates[question.dimension];
    if (prismEstimate && prismEstimate.responseCount < 7) {
      relevance *= 1.3; // Keep building PRISM coverage
    }
  } else if (checkpoint === 4) {
    // Deep dive - prioritize highest uncertainty AND catch up on framework gaps
    const prismSE = state.prismEstimates[question.dimension]?.standardError || 25;
    relevance *= (1 + prismSE / 50);
    
    // Boost PRISM dimensions that are still under-sampled
    const prismEstimate = state.prismEstimates[question.dimension];
    if (prismEstimate && prismEstimate.responseCount < 8) {
      relevance *= 1.5; // Catch up on PRISM coverage
    }
    
    // Boost MBTI questions if any dimension is under-sampled
    if (hasMbtiTag) {
      for (const mbtiDim of mbtiTagsPresent) {
        const estimate = state.mbtiEstimates[mbtiDim];
        if (estimate && estimate.responseCount < 6) {
          relevance *= 2.0; // Strong boost to catch up
        }
        // Extra priority for S/N dimension to ensure adequate coverage
        if (mbtiDim === 'mbti_sn' && estimate && estimate.responseCount < 7) {
          relevance *= 1.5; // Additional boost for S/N
        }
      }
    }
    
    // Boost Enneagram questions if any type is under-sampled
    // With expanded question pool (9-13 per type), aim for 5+ per type for statistical significance
    if (hasEnneagramTag) {
      for (const ennType of enneagramTagsPresent) {
        const estimate = state.enneagramEstimates[ennType];
        if (estimate && estimate.responseCount < 5) {
          relevance *= 2.0; // Strong boost to catch up
        }
      }
    }
  }
  
  return relevance;
}

/**
 * Select the next best question based on current state and checkpoint
 */
export function selectNextQuestion(
  questionBank: Question[],
  state: AdaptiveState,
  options: {
    checkpoint?: number;
    preferHighDiscrimination?: boolean;
  } = {}
): Question | null {
  const checkpoint = options.checkpoint || state.currentCheckpoint;
  const { preferHighDiscrimination = true } = options;
  const config = CHECKPOINT_CONFIG[checkpoint] || CHECKPOINT_CONFIG[1];
  
  // Update cross-framework inferences before selection
  inferMbtiFromPrism(state);
  inferEnneagramFromPrism(state);
  
  // Filter out already-answered questions and duplicates
  const availableQuestions = questionBank.filter(q => {
    if (state.answeredQuestionIds.has(q.id)) return false;
    const normalizedText = normalizeText(q.text);
    if (state.answeredQuestionTexts.has(normalizedText)) return false;
    return true;
  });
  
  if (availableQuestions.length === 0) {
    return null;
  }
  
  // PHASE 1: Coverage - ensure minimum questions per framework target
  const needsCoverage = getFrameworksNeedingCoverage(state, checkpoint);
  
  if (needsCoverage.length > 0) {
    // Find target with most need
    const topTarget = needsCoverage[0];
    
    // Get questions for this target
    const targetQuestions = availableQuestions.filter(q => 
      questionMatchesTarget(q, topTarget)
    );
    
    if (targetQuestions.length > 0) {
      // Sort by discrimination and checkpoint relevance
      targetQuestions.sort((a, b) => {
        const aScore = (a.discrimination || 1) * calculateCheckpointRelevance(a, state, checkpoint);
        const bScore = (b.discrimination || 1) * calculateCheckpointRelevance(b, state, checkpoint);
        return bScore - aScore;
      });
      
      // Pick from top 3 to add variety
      const topN = Math.min(3, targetQuestions.length);
      return targetQuestions[Math.floor(Math.random() * topN)];
    }
  }
  
  // PHASE 2: Adaptive - select based on uncertainty and checkpoint relevance
  const mostUncertain = getMostUncertainForCheckpoint(state, checkpoint);
  
  // Get the current estimate for the most uncertain target
  let currentEstimate = 50;
  if (mostUncertain.type === 'prism') {
    currentEstimate = state.prismEstimates[mostUncertain.id as Dimension]?.estimate || 50;
  } else if (mostUncertain.type === 'mbti') {
    currentEstimate = state.mbtiEstimates[mostUncertain.id]?.estimate || 50;
  } else if (mostUncertain.type === 'enneagram') {
    currentEstimate = state.enneagramEstimates[mostUncertain.id]?.estimate || 50;
  }
  
  // Score all available questions
  const scoredQuestions = availableQuestions.map(q => {
    const discrimination = q.discrimination || 1.0;
    const typeWeight = TYPE_WEIGHTS[q.type] || 1.0;
    
    // Base information value
    let infoValue = calculateInformationValue(q, currentEstimate, discrimination);
    
    // Boost questions that match the most uncertain target
    if (questionMatchesTarget(q, mostUncertain)) {
      infoValue *= 2.5;
    }
    
    // Apply type weight
    infoValue *= typeWeight;
    
    // Apply checkpoint relevance
    infoValue *= calculateCheckpointRelevance(q, state, checkpoint);
    
    // Boost for PRISM dimension uncertainty
    const dimUncertainty = state.prismEstimates[q.dimension]?.standardError || 25;
    infoValue *= (1 + dimUncertainty / 100);
    
    // Apply type variety penalty to prevent too many consecutive same-type questions
    const typeVarietyMultiplier = calculateTypeVarietyMultiplier(
      q.type,
      state.recentQuestionTypes || []
    );
    infoValue *= typeVarietyMultiplier;
    
    return { question: q, score: infoValue };
  });
  
  // Sort by information value (descending)
  scoredQuestions.sort((a, b) => b.score - a.score);
  
  // Pick randomly from top candidates for variety
  const topCandidates = scoredQuestions.slice(0, Math.min(5, scoredQuestions.length));
  const randomIndex = Math.floor(Math.random() * topCandidates.length);
  
  return topCandidates[randomIndex]?.question || null;
}

/**
 * Select a batch of questions for a checkpoint
 */
export function selectQuestionBatch(
  questionBank: Question[],
  state: AdaptiveState,
  batchSize: number,
  options: {
    checkpoint?: number;
    diversifyTypes?: boolean;
    diversifyDimensions?: boolean;
  } = {}
): Question[] {
  const { checkpoint = state.currentCheckpoint, diversifyTypes = true, diversifyDimensions = true } = options;
  const selected: Question[] = [];
  
  // Create a temporary state for selection
  const tempState: AdaptiveState = {
    ...state,
    answeredQuestionIds: new Set(state.answeredQuestionIds),
    answeredQuestionTexts: new Set(state.answeredQuestionTexts),
  };
  
  for (let i = 0; i < batchSize; i++) {
    const next = selectNextQuestion(questionBank, tempState, { checkpoint });
    if (!next) break;
    
    selected.push(next);
    
    // Update temp state to avoid selecting same question
    tempState.answeredQuestionIds.add(next.id);
    tempState.answeredQuestionTexts.add(normalizeText(next.text));
    
    // Simulate a response to update estimates for better diversity
    // This helps avoid clustering on one dimension
    tempState.prismEstimates[next.dimension] = {
      ...tempState.prismEstimates[next.dimension],
      responseCount: tempState.prismEstimates[next.dimension].responseCount + 1,
      standardError: Math.max(5, tempState.prismEstimates[next.dimension].standardError - 2),
    };
  }
  
  // Diversify by interleaving question types
  if (diversifyTypes && selected.length > 1) {
    const byType: Record<string, Question[]> = {};
    for (const q of selected) {
      byType[q.type] = byType[q.type] || [];
      byType[q.type].push(q);
    }
    
    const interleaved: Question[] = [];
    const types = Object.keys(byType);
    let typeIndex = 0;
    
    while (interleaved.length < selected.length) {
      const type = types[typeIndex % types.length];
      const typeQuestions = byType[type];
      if (typeQuestions && typeQuestions.length > 0) {
        interleaved.push(typeQuestions.shift()!);
      }
      typeIndex++;
      
      if (typeQuestions && typeQuestions.length === 0) {
        types.splice(types.indexOf(type), 1);
        if (types.length === 0) break;
      }
    }
    
    // Further diversify by dimension if requested
    if (diversifyDimensions && interleaved.length > 7) {
      const final: Question[] = [];
      const byDim: Record<string, Question[]> = {};
      
      for (const q of interleaved) {
        byDim[q.dimension] = byDim[q.dimension] || [];
        byDim[q.dimension].push(q);
      }
      
      const dims = Object.keys(byDim);
      let dimIndex = 0;
      
      while (final.length < interleaved.length) {
        const dim = dims[dimIndex % dims.length];
        const dimQuestions = byDim[dim];
        if (dimQuestions && dimQuestions.length > 0) {
          final.push(dimQuestions.shift()!);
        }
        dimIndex++;
        
        if (dimQuestions && dimQuestions.length === 0) {
          dims.splice(dims.indexOf(dim), 1);
          if (dims.length === 0) break;
        }
      }
      
      return final;
    }
    
    return interleaved;
  }
  
  return selected;
}

/**
 * Update trait estimates based on a new response
 * Updates PRISM, and propagates to MBTI/Enneagram via framework tags
 */
export function updateTraitEstimate(
  state: AdaptiveState,
  question: Question,
  responseValue: number  // Normalized to 0-100 scale
): AdaptiveState {
  const dimension = question.dimension;
  const tags = question.framework_tags || [];
  
  const discrimination = question.discrimination || 1.0;
  const typeWeight = TYPE_WEIGHTS[question.type] || 1.0;
  const effectiveWeight = discrimination * typeWeight;
  
  // Reverse score if needed
  let adjustedResponse = responseValue;
  if (question.reverse_scored) {
    adjustedResponse = 100 - responseValue;
  }
  
  // Update PRISM estimate
  const prismEstimate = state.prismEstimates[dimension];
  const priorWeight = prismEstimate.sumWeights;
  const newSumWeights = priorWeight + effectiveWeight;
  
  const newPrismEstimate = priorWeight > 0
    ? (prismEstimate.estimate * priorWeight + adjustedResponse * effectiveWeight) / newSumWeights
    : adjustedResponse;
  
  const baseVariance = 625;
  const newVariance = baseVariance / (1 + newSumWeights);
  const newSE = Math.sqrt(newVariance);
  
  const newPrismEstimates = { ...state.prismEstimates };
  newPrismEstimates[dimension] = {
    id: dimension,
    estimate: Math.max(0, Math.min(100, newPrismEstimate)),
    standardError: Math.max(5, newSE),
    responseCount: prismEstimate.responseCount + 1,
    sumWeights: newSumWeights,
  };
  
  // Update MBTI estimates if question has MBTI tags
  const newMbtiEstimates = { ...state.mbtiEstimates };
  for (const mbtiDim of MBTI_DIMENSIONS) {
    if (tags.includes(mbtiDim)) {
      const mbtiEstimate = newMbtiEstimates[mbtiDim];
      const mbtiPriorWeight = mbtiEstimate.sumWeights;
      const mbtiNewSumWeights = mbtiPriorWeight + effectiveWeight;
      
      const newMbtiValue = mbtiPriorWeight > 0
        ? (mbtiEstimate.estimate * mbtiPriorWeight + adjustedResponse * effectiveWeight) / mbtiNewSumWeights
        : adjustedResponse;
      
      const mbtiNewVariance = baseVariance / (1 + mbtiNewSumWeights);
      const mbtiNewSE = Math.sqrt(mbtiNewVariance);
      
      newMbtiEstimates[mbtiDim] = {
        id: mbtiDim,
        estimate: Math.max(0, Math.min(100, newMbtiValue)),
        standardError: Math.max(5, mbtiNewSE),
        responseCount: mbtiEstimate.responseCount + 1,
        sumWeights: mbtiNewSumWeights,
        inferredFrom: mbtiEstimate.inferredFrom,
      };
    }
  }
  
  // Update Enneagram estimates if question has Enneagram tags
  const newEnneagramEstimates = { ...state.enneagramEstimates };
  for (const ennType of ENNEAGRAM_TYPES) {
    if (tags.includes(ennType)) {
      const ennEstimate = newEnneagramEstimates[ennType];
      const ennPriorWeight = ennEstimate.sumWeights;
      const ennNewSumWeights = ennPriorWeight + effectiveWeight;
      
      const newEnnValue = ennPriorWeight > 0
        ? (ennEstimate.estimate * ennPriorWeight + adjustedResponse * effectiveWeight) / ennNewSumWeights
        : adjustedResponse;
      
      const ennNewVariance = baseVariance / (1 + ennNewSumWeights);
      const ennNewSE = Math.sqrt(ennNewVariance);
      
      newEnneagramEstimates[ennType] = {
        id: ennType,
        estimate: Math.max(0, Math.min(100, newEnnValue)),
        standardError: Math.max(5, ennNewSE),
        responseCount: ennEstimate.responseCount + 1,
        sumWeights: ennNewSumWeights,
        inferredFrom: ennEstimate.inferredFrom,
      };
    }
  }
  
  // Determine current checkpoint based on questions answered
  const newQuestionsAnswered = state.questionsAnswered + 1;
  let newCheckpoint = 1;
  if (newQuestionsAnswered >= 80) newCheckpoint = 4;
  else if (newQuestionsAnswered >= 55) newCheckpoint = 3;
  else if (newQuestionsAnswered >= 35) newCheckpoint = 2;
  
  // Update recent question types for variety tracking
  const newRecentTypes = [...(state.recentQuestionTypes || []), question.type];
  // Keep only the last RECENT_TYPES_WINDOW entries
  while (newRecentTypes.length > RECENT_TYPES_WINDOW) {
    newRecentTypes.shift();
  }
  
  return {
    prismEstimates: newPrismEstimates,
    mbtiEstimates: newMbtiEstimates,
    enneagramEstimates: newEnneagramEstimates,
    answeredQuestionIds: new Set([...state.answeredQuestionIds, question.id]),
    answeredQuestionTexts: new Set([...state.answeredQuestionTexts, normalizeText(question.text)]),
    currentCheckpoint: newCheckpoint,
    questionsAnswered: newQuestionsAnswered,
    recentQuestionTypes: newRecentTypes,
  };
}

/**
 * Normalize a raw response to 0-100 scale
 */
export function normalizeResponse(
  response: string | number,
  questionType: string
): number {
  if (typeof response === 'number') {
    // Likert 1-7 -> 0-100
    if (questionType === 'likert') {
      return ((response - 1) / 6) * 100;
    }
    // Behavioral frequency 1-5 -> 0-100
    if (questionType === 'behavioral_frequency') {
      return ((response - 1) / 4) * 100;
    }
    return response;
  }
  
  // Situational judgment: first option is typically high, last is low
  if (questionType === 'situational_judgment') {
    try {
      const idx = parseInt(response);
      // Assume 3 options: 0 = high (100), 1 = medium (50), 2 = low (0)
      return Math.max(0, 100 - (idx * 50));
    } catch {
      return 50;
    }
  }
  
  // Forced choice: handled separately
  if (questionType === 'forced_choice') {
    // This is complex - need to parse most/least
    // For now return neutral
    return 50;
  }
  
  return 50; // Default neutral
}

/**
 * Get summary statistics about current adaptive state
 */
export function getAdaptiveStats(state: AdaptiveState): {
  totalAnswered: number;
  currentCheckpoint: number;
  prism: {
    averageUncertainty: number;
    mostUncertain: Dimension;
    breakdown: Array<{ dimension: Dimension; estimate: number; se: number; count: number }>;
  };
  mbti: {
    breakdown: Array<{ dimension: string; estimate: number; se: number; count: number }>;
  };
  enneagram: {
    topTypes: Array<{ type: string; estimate: number; se: number }>;
  };
} {
  const totalAnswered = state.questionsAnswered;
  
  // PRISM stats
  let prismTotalSE = 0;
  let prismMaxSE = -1;
  let prismMostUncertain: Dimension = 'openness';
  const prismBreakdown: Array<{ dimension: Dimension; estimate: number; se: number; count: number }> = [];
  
  for (const dim of PRISM_DIMENSIONS) {
    const est = state.prismEstimates[dim];
    prismTotalSE += est.standardError;
    
    if (est.standardError > prismMaxSE) {
      prismMaxSE = est.standardError;
      prismMostUncertain = dim;
    }
    
    prismBreakdown.push({
      dimension: dim,
      estimate: Math.round(est.estimate),
      se: Math.round(est.standardError * 10) / 10,
      count: est.responseCount,
    });
  }
  
  // MBTI stats
  const mbtiBreakdown: Array<{ dimension: string; estimate: number; se: number; count: number }> = [];
  for (const dim of MBTI_DIMENSIONS) {
    const est = state.mbtiEstimates[dim];
    mbtiBreakdown.push({
      dimension: dim,
      estimate: Math.round(est.estimate),
      se: Math.round(est.standardError * 10) / 10,
      count: est.responseCount,
    });
  }
  
  // Enneagram stats - show top 3 types
  const ennScores = ENNEAGRAM_TYPES.map(type => ({
    type,
    estimate: state.enneagramEstimates[type].estimate,
    se: state.enneagramEstimates[type].standardError,
  })).sort((a, b) => b.estimate - a.estimate);
  
  return {
    totalAnswered,
    currentCheckpoint: state.currentCheckpoint,
    prism: {
      averageUncertainty: Math.round((prismTotalSE / PRISM_DIMENSIONS.length) * 10) / 10,
      mostUncertain: prismMostUncertain,
      breakdown: prismBreakdown,
    },
    mbti: {
      breakdown: mbtiBreakdown,
    },
    enneagram: {
      topTypes: ennScores.slice(0, 3).map(e => ({
        type: e.type,
        estimate: Math.round(e.estimate),
        se: Math.round(e.se * 10) / 10,
      })),
    },
  };
}

/**
 * Check if we have sufficient precision for the current checkpoint
 */
export function hasCheckpointPrecision(
  state: AdaptiveState,
  precisionThreshold: number = 12
): boolean {
  const config = CHECKPOINT_CONFIG[state.currentCheckpoint] || CHECKPOINT_CONFIG[1];
  
  // Check PRISM precision
  for (const dim of PRISM_DIMENSIONS) {
    if (state.prismEstimates[dim].standardError > precisionThreshold) {
      return false;
    }
  }
  
  // Check MBTI precision if applicable
  if (config.frameworks.includes('mbti')) {
    for (const dim of MBTI_DIMENSIONS) {
      if (state.mbtiEstimates[dim].standardError > precisionThreshold + 5) {
        return false;
      }
    }
  }
  
  return true;
}

/**
 * Serialize adaptive state for storage (localStorage or database)
 */
export function serializeAdaptiveState(state: AdaptiveState): string {
  return JSON.stringify({
    prismEstimates: state.prismEstimates,
    mbtiEstimates: state.mbtiEstimates,
    enneagramEstimates: state.enneagramEstimates,
    answeredQuestionIds: Array.from(state.answeredQuestionIds),
    answeredQuestionTexts: Array.from(state.answeredQuestionTexts),
    currentCheckpoint: state.currentCheckpoint,
    questionsAnswered: state.questionsAnswered,
    recentQuestionTypes: state.recentQuestionTypes || [],
  });
}

/**
 * Deserialize adaptive state from storage
 */
export function deserializeAdaptiveState(json: string): AdaptiveState {
  const data = JSON.parse(json);
  return {
    prismEstimates: data.prismEstimates,
    mbtiEstimates: data.mbtiEstimates,
    enneagramEstimates: data.enneagramEstimates,
    answeredQuestionIds: new Set(data.answeredQuestionIds),
    answeredQuestionTexts: new Set(data.answeredQuestionTexts),
    currentCheckpoint: data.currentCheckpoint,
    questionsAnswered: data.questionsAnswered,
    recentQuestionTypes: data.recentQuestionTypes || [],
  };
}

/**
 * Get the current checkpoint number based on questions answered
 */
export function getCurrentCheckpointNumber(questionsAnswered: number): number {
  if (questionsAnswered >= 80) return 4;
  if (questionsAnswered >= 55) return 3;
  if (questionsAnswered >= 35) return 2;
  return 1;
}

/**
 * Framework confidence levels
 */
export type ConfidenceLevel = 'none' | 'low' | 'moderate' | 'high';

export interface FrameworkConfidence {
  level: ConfidenceLevel;
  percentage: number;          // 0-100
  canShow: boolean;            // Whether to show results at all
  showWarning: boolean;        // Whether to show a low-confidence warning
  message: string;             // User-facing message
  questionsAnswered: number;   // Questions directly targeting this framework
  questionsNeeded: number;     // Questions needed for high confidence
}

/**
 * Calculate confidence level for each framework based on questions answered
 * This determines what results to show and with what caveats
 */
export function calculateFrameworkConfidence(
  questionsAnswered: number,
  adaptiveState?: AdaptiveState
): {
  prism: FrameworkConfidence;
  mbti: FrameworkConfidence;
  enneagram: FrameworkConfidence;
} {
  // PRISM-7: Need at least 35 questions (5 per dimension)
  const prismQuestions = Math.min(questionsAnswered, 35);
  const prismPerDim = prismQuestions / 7;
  const prismConfidence: FrameworkConfidence = {
    level: prismPerDim >= 8 ? 'high' : prismPerDim >= 5 ? 'moderate' : prismPerDim >= 3 ? 'low' : 'none',
    percentage: Math.min(100, Math.round((prismPerDim / 8) * 100)),
    canShow: prismPerDim >= 3,
    showWarning: prismPerDim < 5,
    message: prismPerDim >= 5 
      ? 'Your PRISM-7 profile is complete'
      : prismPerDim >= 3 
        ? 'Preliminary results - complete more questions for higher accuracy'
        : 'Not enough data yet',
    questionsAnswered: prismQuestions,
    questionsNeeded: 35,
  };
  
  // MBTI: Need checkpoint 2 (questions 36-55) - 20 questions total
  // Plus cross-framework inference from PRISM
  const mbtiDirectQuestions = Math.max(0, Math.min(questionsAnswered - 35, 20));
  const mbtiWithInference = mbtiDirectQuestions + (prismPerDim >= 5 ? 8 : 0); // PRISM inference worth ~8 questions
  const mbtiPerDim = mbtiWithInference / 4;
  const mbtiConfidence: FrameworkConfidence = {
    level: questionsAnswered < 35 ? 'none' 
      : mbtiPerDim >= 6 ? 'high' 
      : mbtiPerDim >= 4 ? 'moderate' 
      : mbtiPerDim >= 2 ? 'low' 
      : 'none',
    percentage: questionsAnswered < 35 ? 0 : Math.min(100, Math.round((mbtiPerDim / 6) * 100)),
    canShow: questionsAnswered >= 35 && mbtiPerDim >= 2,
    showWarning: questionsAnswered < 55 || mbtiPerDim < 4,
    message: questionsAnswered < 35 
      ? 'Complete PRISM-7 assessment first (checkpoint 1)'
      : mbtiPerDim >= 4 
        ? 'Your MBTI type is determined with good confidence'
        : 'Preliminary MBTI type - complete checkpoint 2 for higher accuracy',
    questionsAnswered: mbtiDirectQuestions,
    questionsNeeded: 20,
  };
  
  // Enneagram: Need checkpoint 3 (questions 56-80) - 25 questions total
  // Plus cross-framework inference from PRISM
  // With expanded question pool (9-13 questions per type), we can achieve higher confidence
  const ennDirectQuestions = Math.max(0, Math.min(questionsAnswered - 55, 25));
  const ennWithInference = ennDirectQuestions + (prismPerDim >= 5 ? 9 : 0); // PRISM inference worth ~9 questions
  const ennPerType = ennWithInference / 9;
  const enneagramConfidence: FrameworkConfidence = {
    level: questionsAnswered < 55 ? 'none'
      : ennPerType >= 5 ? 'high'  // Increased from 4 for better accuracy with more questions
      : ennPerType >= 3 ? 'moderate'  // Increased from 2
      : ennPerType >= 1 ? 'low'
      : 'none',
    percentage: questionsAnswered < 55 ? 0 : Math.min(100, Math.round((ennPerType / 5) * 100)),
    canShow: questionsAnswered >= 55 && ennPerType >= 1,
    showWarning: questionsAnswered < 80 || ennPerType < 3,
    message: questionsAnswered < 55
      ? 'Complete MBTI assessment first (checkpoint 2)'
      : ennPerType >= 3
        ? 'Your Enneagram type is determined with good confidence'
        : 'Preliminary Enneagram type - complete checkpoint 3 for higher accuracy',
    questionsAnswered: ennDirectQuestions,
    questionsNeeded: 25,
  };
  
  return {
    prism: prismConfidence,
    mbti: mbtiConfidence,
    enneagram: enneagramConfidence,
  };
}

/**
 * Get which frameworks should be shown in results based on assessment progress
 */
export function getShowableFrameworks(questionsAnswered: number): {
  showPrism: boolean;
  showMbti: boolean;
  showEnneagram: boolean;
  showDetailedInsights: boolean;
  continuePrompt?: string;
} {
  const confidence = calculateFrameworkConfidence(questionsAnswered);
  
  let continuePrompt: string | undefined;
  
  if (questionsAnswered < 35) {
    continuePrompt = 'Complete the assessment to see your PRISM-7 personality profile';
  } else if (questionsAnswered < 55) {
    continuePrompt = 'Continue to checkpoint 2 to unlock your MBTI type';
  } else if (questionsAnswered < 80) {
    continuePrompt = 'Continue to checkpoint 3 to discover your Enneagram type';
  } else if (questionsAnswered < 105) {
    continuePrompt = 'Complete the full assessment for detailed facet-level insights';
  }
  
  return {
    showPrism: confidence.prism.canShow,
    showMbti: confidence.mbti.canShow,
    showEnneagram: confidence.enneagram.canShow,
    showDetailedInsights: questionsAnswered >= 105,
    continuePrompt,
  };
}

