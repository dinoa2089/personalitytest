/**
 * Mock scoring function for development/testing when Python API is not available
 * Generates realistic dimensional scores with percentiles and confidence intervals
 * 
 * Uses IRT-informed weighting:
 * - effective_weight = type_weight × discrimination
 * - score = sum(response × effective_weight) / sum(effective_weight)
 * - confidence_margin = base_margin / sqrt(sum(discrimination²))
 */
import type { QuestionResponse, DimensionScore, ForcedChoiceOption, Question, Dimension } from "@/types";

// Import mock questions to access forced-choice options with dimension mappings
import { mockQuestions } from "./mock-questions";

// Question type base weights
const TYPE_WEIGHTS: Record<string, number> = {
  likert: 1.0,
  forced_choice: 1.2,
  situational_judgment: 1.3,
  behavioral_frequency: 1.5,
};

/**
 * Type guard to check if options are ForcedChoiceOption[]
 */
function isForcedChoiceOptions(options: any): options is ForcedChoiceOption[] {
  return (
    Array.isArray(options) &&
    options.length > 0 &&
    typeof options[0] === "object" &&
    "dimension" in options[0]
  );
}

/**
 * Score a forced-choice response across multiple dimensions
 * Returns a Map of dimension -> score adjustment
 */
function scoreForcedChoice(
  responseValue: any,
  options: ForcedChoiceOption[]
): Map<string, number> {
  const scores = new Map<string, number>();

  let parsed = responseValue;
  if (typeof responseValue === "string") {
    try {
      parsed = JSON.parse(responseValue);
    } catch {
      // If parsing fails, return empty scores
      return scores;
    }
  }

  if (typeof parsed === "object" && parsed !== null) {
    const mostOption = options.find((o) => o.text === parsed.most);
    const leastOption = options.find((o) => o.text === parsed.least);

    if (mostOption) {
      scores.set(mostOption.dimension, 2); // +2 for most
    }
    if (leastOption) {
      const currentScore = scores.get(leastOption.dimension) || 0;
      scores.set(leastOption.dimension, currentScore - 1); // -1 for least
    }
  }

  return scores;
}

/**
 * Get the question data including options by question ID
 */
function getQuestionById(questionId: string): Question | undefined {
  return mockQuestions.find((q) => q.id === questionId);
}

/**
 * Extended response with question metadata for IRT-informed scoring
 */
export interface ResponseWithMetadata extends QuestionResponse {
  discrimination?: number;
  difficulty?: number;
}

/**
 * Calculate effective weight using IRT discrimination parameter
 * effective_weight = type_weight × discrimination
 */
function getEffectiveWeight(questionType: string, discrimination: number = 1.0): number {
  const typeWeight = TYPE_WEIGHTS[questionType] || 1.0;
  return typeWeight * discrimination;
}

/**
 * Main scoring function with IRT-informed discrimination weighting
 */
export function mockCalculateScores(
  responses: (QuestionResponse | ResponseWithMetadata)[],
  sessionId: string
): { dimensional_scores: DimensionScore[]; completed: boolean } {
  // Initialize score accumulators for each dimension
  const dimensions: Dimension[] = [
    "openness",
    "conscientiousness",
    "extraversion",
    "agreeableness",
    "emotionalResilience",
    "honestyHumility",
    "adaptability",
  ];

  // Track both weighted scores and sum of discrimination² for confidence calculation
  const dimensionScores: Record<string, { 
    totalScore: number; 
    totalWeight: number; 
    count: number;
    sumDiscriminationSquared: number;
  }> = {};
  
  for (const dim of dimensions) {
    dimensionScores[dim] = { totalScore: 0, totalWeight: 0, count: 0, sumDiscriminationSquared: 0 };
  }

  // Process each response
  for (const response of responses) {
    // Get discrimination from response metadata or question lookup
    let discrimination = 1.0;
    if ('discrimination' in response && response.discrimination !== undefined) {
      discrimination = response.discrimination;
    } else {
      // Fallback: lookup from mock questions
      const question = getQuestionById(response.question_id);
      if (question?.discrimination !== undefined) {
        discrimination = question.discrimination;
      }
    }

    // Calculate effective weight using IRT formula
    const effectiveWeight = getEffectiveWeight(response.question_type, discrimination);

    if (response.question_type === "forced_choice") {
      // Get the question to access its options
      const question = getQuestionById(response.question_id);

      if (question?.options && isForcedChoiceOptions(question.options)) {
        // Score across multiple dimensions
        const multiDimScores = scoreForcedChoice(response.response, question.options);

        for (const [dimension, score] of multiDimScores) {
          if (dimensionScores[dimension]) {
            // Normalize forced-choice score: +2 becomes 8, 0 becomes 5, -1 becomes 3
            const normalizedScore = 5 + (score * 1.5); // Maps -1->3.5, 0->5, +2->8
            dimensionScores[dimension].totalScore += normalizedScore * effectiveWeight;
            dimensionScores[dimension].totalWeight += effectiveWeight;
            dimensionScores[dimension].count += 1;
            dimensionScores[dimension].sumDiscriminationSquared += discrimination * discrimination;
          }
        }
      } else {
        // Fallback: old-style string options - score to primary dimension
        const score = scoreSimpleResponse(response);
        const dim = response.dimension;
        dimensionScores[dim].totalScore += score * effectiveWeight;
        dimensionScores[dim].totalWeight += effectiveWeight;
        dimensionScores[dim].count += 1;
        dimensionScores[dim].sumDiscriminationSquared += discrimination * discrimination;
      }
    } else {
      // Non-forced-choice: score to primary dimension
      const score = scoreSimpleResponse(response);
      const dim = response.dimension;
      dimensionScores[dim].totalScore += score * effectiveWeight;
      dimensionScores[dim].totalWeight += effectiveWeight;
      dimensionScores[dim].count += 1;
      dimensionScores[dim].sumDiscriminationSquared += discrimination * discrimination;
    }
  }

  // Calculate final scores for each dimension
  const dimensional_scores: DimensionScore[] = [];

  for (const dimension of dimensions) {
    const data = dimensionScores[dimension];

    // Normalize to 0-100 scale
    const normalizedScore =
      data.totalWeight > 0
        ? Math.max(0, Math.min(100, (data.totalScore / data.totalWeight) * 10))
        : 50; // Default to middle if no responses

    // Calculate percentile (with some realistic variation)
    const percentile = calculatePercentile(normalizedScore, dimension);

    // Calculate confidence interval using IRT-informed margin
    // confidence_margin = base_margin / sqrt(sum(discrimination²))
    const sumDiscSq = data.sumDiscriminationSquared;
    const baseMargin = 10; // Base standard error
    const irtAdjustedSE = sumDiscSq > 0 
      ? Math.max(2, baseMargin / Math.sqrt(sumDiscSq))
      : Math.max(2, baseMargin / Math.sqrt(Math.max(1, data.count)));
    const margin = 1.645 * irtAdjustedSE; // 90% confidence interval

    const confidence_interval: [number, number] = [
      Math.max(0, percentile - margin),
      Math.min(100, percentile + margin),
    ];

    dimensional_scores.push({
      dimension: dimension as DimensionScore["dimension"],
      raw_score: normalizedScore,
      percentile,
      confidence_interval,
    });
  }

  return {
    dimensional_scores,
    completed: true,
  };
}

function getQuestionWeight(questionType: string): number {
  return TYPE_WEIGHTS[questionType] || 1.0;
}

/**
 * Score a simple (non-forced-choice) response
 */
function scoreSimpleResponse(response: QuestionResponse): number {
  const { question_type, response: responseValue } = response;

  if (question_type === "likert") {
    // Likert scale: 1-7, normalize to 0-10 for consistent scoring
    if (typeof responseValue === "number") {
      // Convert 1-7 scale to 0-10
      return ((responseValue - 1) / 6) * 10;
    }
    if (typeof responseValue === "string") {
      const num = parseFloat(responseValue);
      if (isNaN(num)) return 5; // Default to middle
      return ((num - 1) / 6) * 10;
    }
    return 5;
  }

  if (question_type === "situational_judgment") {
    // Map option selection to score based on option index
    if (typeof responseValue === "string") {
      // Options typically ordered from most to least aligned with the trait
      const optionIndex = parseInt(responseValue, 10);
      if (!isNaN(optionIndex)) {
        // Assume 3-4 options, first is highest trait expression
        return Math.max(1, 10 - optionIndex * 2.5);
      }
      // Letter-based options
      if (responseValue === "A") return 9;
      if (responseValue === "B") return 7;
      if (responseValue === "C") return 4;
      if (responseValue === "D") return 2;
      return 5;
    }
    if (typeof responseValue === "number") {
      // Normalize to 0-10 scale
      return Math.max(0, Math.min(10, responseValue * 2));
    }
    return 5;
  }

  if (question_type === "behavioral_frequency") {
    // Behavioral frequency: 1-5 scale, normalize to 0-10
    if (typeof responseValue === "number") {
      return ((responseValue - 1) / 4) * 10;
    }
    if (typeof responseValue === "string") {
      const num = parseFloat(responseValue);
      if (isNaN(num)) return 5;
      return ((num - 1) / 4) * 10;
    }
    return 5;
  }

  return 5; // Default to middle score
}

function calculatePercentile(rawScore: number, dimension: string): number {
  // Calculate percentile based on actual response data
  // Using normative distribution assumptions for personality traits

  // Personality traits typically follow a normal distribution
  // We map the raw score (0-100) to a percentile using a sigmoid-like transformation
  // This creates more realistic clustering around the middle with fewer extreme scores

  // Dimension-specific calibration based on population norms
  // These offsets reflect that some traits have different population means
  const dimensionCalibration: Record<string, { mean: number; spread: number }> = {
    openness: { mean: 50, spread: 1.0 },
    conscientiousness: { mean: 52, spread: 0.95 },
    extraversion: { mean: 48, spread: 1.05 },
    agreeableness: { mean: 55, spread: 0.9 },
    emotionalResilience: { mean: 50, spread: 1.0 },
    honestyHumility: { mean: 53, spread: 0.95 },
    adaptability: { mean: 50, spread: 1.0 },
  };

  const calibration = dimensionCalibration[dimension] || { mean: 50, spread: 1.0 };

  // Apply calibration to raw score
  const calibratedScore = (rawScore - 50) * calibration.spread + calibration.mean;

  // Ensure percentile stays within valid range
  return Math.max(1, Math.min(99, Math.round(calibratedScore)));
}
