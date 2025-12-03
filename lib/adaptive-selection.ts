/**
 * Adaptive Question Selection System
 * 
 * Implements IRT-based adaptive testing that:
 * 1. Tracks current trait estimates for each PRISM-7 dimension
 * 2. Calculates uncertainty (standard error) for each dimension
 * 3. Selects questions that maximize information gain for uncertain dimensions
 * 4. Prevents duplicate/similar questions from being asked
 * 
 * Based on the methodology in improved_personality_test_framework.md:
 * - Initial items selected to provide broad coverage of all dimensions
 * - Subsequent items selected based on information value at current trait estimate
 * - Items with highest discrimination at current trait level prioritized
 */

import type { Question, QuestionResponse, Dimension } from '@/types';

// PRISM-7 Dimensions
const DIMENSIONS: Dimension[] = [
  'openness',
  'conscientiousness', 
  'extraversion',
  'agreeableness',
  'emotionalResilience',
  'honestyHumility',
  'adaptability',
];

// Question type weights (from methodology)
const TYPE_WEIGHTS: Record<string, number> = {
  behavioral_frequency: 1.5,
  situational_judgment: 1.3,
  forced_choice: 1.2,
  likert: 1.0,
};

/**
 * Trait estimate for a single dimension
 */
export interface TraitEstimate {
  dimension: Dimension;
  estimate: number;        // Current trait estimate (0-100 scale)
  standardError: number;   // Uncertainty in the estimate
  responseCount: number;   // Number of questions answered for this dimension
  sumWeights: number;      // Sum of effective weights for precision calculation
}

/**
 * Adaptive selection state that persists across the assessment
 */
export interface AdaptiveState {
  traitEstimates: Record<Dimension, TraitEstimate>;
  answeredQuestionIds: Set<string>;
  answeredQuestionTexts: Set<string>;  // Normalized texts to prevent duplicates
  phase: 'coverage' | 'adaptive';      // Initial coverage phase vs adaptive phase
  questionsInPhase: number;
}

/**
 * Initialize adaptive state at the start of an assessment
 */
export function initializeAdaptiveState(): AdaptiveState {
  const traitEstimates: Record<string, TraitEstimate> = {};
  
  for (const dim of DIMENSIONS) {
    traitEstimates[dim] = {
      dimension: dim,
      estimate: 50,          // Start at population mean
      standardError: 25,     // High initial uncertainty
      responseCount: 0,
      sumWeights: 0,
    };
  }
  
  return {
    traitEstimates: traitEstimates as Record<Dimension, TraitEstimate>,
    answeredQuestionIds: new Set(),
    answeredQuestionTexts: new Set(),
    phase: 'coverage',
    questionsInPhase: 0,
  };
}

/**
 * Normalize text for duplicate detection
 */
function normalizeText(text: string): string {
  return text.toLowerCase().trim().replace(/[^\w\s]/g, '').replace(/\s+/g, ' ');
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
 * Get the dimension with highest uncertainty (most need for more questions)
 */
export function getMostUncertainDimension(state: AdaptiveState): Dimension {
  let maxUncertainty = -1;
  let mostUncertain: Dimension = 'openness';
  
  for (const dim of DIMENSIONS) {
    const estimate = state.traitEstimates[dim];
    // Uncertainty = SE adjusted by response count
    // We want to balance between high SE and low response count
    const uncertainty = estimate.standardError * (1 + 1 / (estimate.responseCount + 1));
    
    if (uncertainty > maxUncertainty) {
      maxUncertainty = uncertainty;
      mostUncertain = dim;
    }
  }
  
  return mostUncertain;
}

/**
 * Get dimensions that still need coverage (minimum questions not met)
 */
export function getDimensionsNeedingCoverage(
  state: AdaptiveState,
  minPerDimension: number
): Dimension[] {
  return DIMENSIONS.filter(dim => 
    state.traitEstimates[dim].responseCount < minPerDimension
  );
}

/**
 * Select the next best question based on current state
 */
export function selectNextQuestion(
  questionBank: Question[],
  state: AdaptiveState,
  options: {
    minPerDimension?: number;      // Minimum questions per dimension before going adaptive
    preferHighDiscrimination?: boolean;
  } = {}
): Question | null {
  const { minPerDimension = 3, preferHighDiscrimination = true } = options;
  
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
  
  // PHASE 1: Coverage - ensure minimum questions per dimension
  const needsCoverage = getDimensionsNeedingCoverage(state, minPerDimension);
  
  if (needsCoverage.length > 0) {
    // Find dimension with lowest coverage
    const lowestCoverageDim = needsCoverage.reduce((lowest, dim) => {
      const lowestCount = state.traitEstimates[lowest].responseCount;
      const dimCount = state.traitEstimates[dim].responseCount;
      return dimCount < lowestCount ? dim : lowest;
    }, needsCoverage[0]);
    
    // Get questions for this dimension
    const dimQuestions = availableQuestions.filter(q => q.dimension === lowestCoverageDim);
    
    if (dimQuestions.length > 0) {
      // Prefer higher discrimination questions
      if (preferHighDiscrimination) {
        dimQuestions.sort((a, b) => (b.discrimination || 1) - (a.discrimination || 1));
      }
      return dimQuestions[0];
    }
  }
  
  // PHASE 2: Adaptive - select based on uncertainty and information value
  const mostUncertain = getMostUncertainDimension(state);
  const currentEstimate = state.traitEstimates[mostUncertain].estimate;
  
  // Score all available questions
  const scoredQuestions = availableQuestions.map(q => {
    const discrimination = q.discrimination || 1.0;
    const typeWeight = TYPE_WEIGHTS[q.type] || 1.0;
    
    // Calculate information value
    let infoValue = calculateInformationValue(q, currentEstimate, discrimination);
    
    // Boost questions for the most uncertain dimension
    if (q.dimension === mostUncertain) {
      infoValue *= 2.0;
    }
    
    // Apply type weight
    infoValue *= typeWeight;
    
    // Slight boost for dimensions with higher uncertainty
    const dimUncertainty = state.traitEstimates[q.dimension].standardError;
    infoValue *= (1 + dimUncertainty / 100);
    
    return { question: q, score: infoValue };
  });
  
  // Sort by information value (descending)
  scoredQuestions.sort((a, b) => b.score - a.score);
  
  // Add some randomization among top candidates to avoid predictability
  // Pick randomly from top 5 candidates
  const topCandidates = scoredQuestions.slice(0, Math.min(5, scoredQuestions.length));
  const randomIndex = Math.floor(Math.random() * topCandidates.length);
  
  return topCandidates[randomIndex]?.question || null;
}

/**
 * Select a batch of questions (for pre-loading or checkpoint)
 */
export function selectQuestionBatch(
  questionBank: Question[],
  state: AdaptiveState,
  batchSize: number,
  options: {
    minPerDimension?: number;
    diversifyTypes?: boolean;
  } = {}
): Question[] {
  const { minPerDimension = 3, diversifyTypes = true } = options;
  const selected: Question[] = [];
  const tempState = { ...state };
  
  for (let i = 0; i < batchSize; i++) {
    const next = selectNextQuestion(questionBank, tempState, { minPerDimension });
    if (!next) break;
    
    selected.push(next);
    
    // Update temp state to avoid selecting same question
    tempState.answeredQuestionIds = new Set([...tempState.answeredQuestionIds, next.id]);
    tempState.answeredQuestionTexts = new Set([
      ...tempState.answeredQuestionTexts, 
      normalizeText(next.text)
    ]);
  }
  
  // Optionally shuffle to diversify question types
  if (diversifyTypes && selected.length > 1) {
    // Group by type and interleave
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
      
      // Remove empty type arrays
      if (typeQuestions && typeQuestions.length === 0) {
        types.splice(types.indexOf(type), 1);
        if (types.length === 0) break;
      }
    }
    
    return interleaved;
  }
  
  return selected;
}

/**
 * Update trait estimates based on a new response
 * Uses Bayesian updating with weighted evidence
 */
export function updateTraitEstimate(
  state: AdaptiveState,
  question: Question,
  responseValue: number  // Normalized to 0-100 scale
): AdaptiveState {
  const dimension = question.dimension;
  const estimate = state.traitEstimates[dimension];
  
  const discrimination = question.discrimination || 1.0;
  const typeWeight = TYPE_WEIGHTS[question.type] || 1.0;
  const effectiveWeight = discrimination * typeWeight;
  
  // Reverse score if needed
  let adjustedResponse = responseValue;
  if (question.reverse_scored) {
    adjustedResponse = 100 - responseValue;
  }
  
  // Bayesian update of estimate
  // New estimate = weighted average of prior and new evidence
  const priorWeight = estimate.sumWeights;
  const newSumWeights = priorWeight + effectiveWeight;
  
  const newEstimate = priorWeight > 0
    ? (estimate.estimate * priorWeight + adjustedResponse * effectiveWeight) / newSumWeights
    : adjustedResponse;
  
  // Update standard error
  // SE decreases as we get more information (more high-discrimination questions)
  const baseVariance = 625; // (25)^2 - initial variance
  const newVariance = baseVariance / (1 + newSumWeights);
  const newSE = Math.sqrt(newVariance);
  
  // Create updated state
  const newTraitEstimates = { ...state.traitEstimates };
  newTraitEstimates[dimension] = {
    dimension,
    estimate: Math.max(0, Math.min(100, newEstimate)),
    standardError: Math.max(5, newSE), // Minimum SE of 5
    responseCount: estimate.responseCount + 1,
    sumWeights: newSumWeights,
  };
  
  return {
    ...state,
    traitEstimates: newTraitEstimates,
    answeredQuestionIds: new Set([...state.answeredQuestionIds, question.id]),
    answeredQuestionTexts: new Set([...state.answeredQuestionTexts, normalizeText(question.text)]),
    questionsInPhase: state.questionsInPhase + 1,
    phase: state.phase === 'coverage' && 
           getDimensionsNeedingCoverage({ ...state, traitEstimates: newTraitEstimates }, 3).length === 0
           ? 'adaptive' 
           : state.phase,
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
  averageUncertainty: number;
  mostUncertainDimension: Dimension;
  leastUncertainDimension: Dimension;
  phase: string;
  dimensionBreakdown: Array<{
    dimension: Dimension;
    estimate: number;
    standardError: number;
    responseCount: number;
  }>;
} {
  const totalAnswered = state.answeredQuestionIds.size;
  
  let totalUncertainty = 0;
  let maxUncertainty = -1;
  let minUncertainty = Infinity;
  let mostUncertain: Dimension = 'openness';
  let leastUncertain: Dimension = 'openness';
  
  const dimensionBreakdown = [];
  
  for (const dim of DIMENSIONS) {
    const est = state.traitEstimates[dim];
    totalUncertainty += est.standardError;
    
    if (est.standardError > maxUncertainty) {
      maxUncertainty = est.standardError;
      mostUncertain = dim;
    }
    if (est.standardError < minUncertainty) {
      minUncertainty = est.standardError;
      leastUncertain = dim;
    }
    
    dimensionBreakdown.push({
      dimension: dim,
      estimate: Math.round(est.estimate),
      standardError: Math.round(est.standardError * 10) / 10,
      responseCount: est.responseCount,
    });
  }
  
  return {
    totalAnswered,
    averageUncertainty: Math.round((totalUncertainty / DIMENSIONS.length) * 10) / 10,
    mostUncertainDimension: mostUncertain,
    leastUncertainDimension: leastUncertain,
    phase: state.phase,
    dimensionBreakdown,
  };
}

/**
 * Check if we have sufficient precision to stop early
 */
export function canStopEarly(
  state: AdaptiveState,
  precisionThreshold: number = 10
): boolean {
  // Check if all dimensions have SE below threshold
  for (const dim of DIMENSIONS) {
    if (state.traitEstimates[dim].standardError > precisionThreshold) {
      return false;
    }
  }
  return true;
}

/**
 * Serialize adaptive state for storage
 */
export function serializeAdaptiveState(state: AdaptiveState): string {
  return JSON.stringify({
    traitEstimates: state.traitEstimates,
    answeredQuestionIds: Array.from(state.answeredQuestionIds),
    answeredQuestionTexts: Array.from(state.answeredQuestionTexts),
    phase: state.phase,
    questionsInPhase: state.questionsInPhase,
  });
}

/**
 * Deserialize adaptive state from storage
 */
export function deserializeAdaptiveState(json: string): AdaptiveState {
  const data = JSON.parse(json);
  return {
    traitEstimates: data.traitEstimates,
    answeredQuestionIds: new Set(data.answeredQuestionIds),
    answeredQuestionTexts: new Set(data.answeredQuestionTexts),
    phase: data.phase,
    questionsInPhase: data.questionsInPhase,
  };
}

