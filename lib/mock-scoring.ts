/**
 * Mock scoring function for development/testing when Python API is not available
 * Generates realistic dimensional scores with percentiles and confidence intervals
 */
import type { QuestionResponse, DimensionScore } from "@/types";

export function mockCalculateScores(
  responses: QuestionResponse[],
  sessionId: string
): { dimensional_scores: DimensionScore[]; completed: boolean } {
  // Group responses by dimension
  const dimensionResponses: Record<string, QuestionResponse[]> = {};
  
  for (const response of responses) {
    const dim = response.dimension;
    if (!dimensionResponses[dim]) {
      dimensionResponses[dim] = [];
    }
    dimensionResponses[dim].push(response);
  }

  // Calculate scores for each dimension
  const dimensional_scores: DimensionScore[] = [];
  
  const dimensions: Array<keyof typeof dimensionResponses> = [
    "openness",
    "conscientiousness",
    "extraversion",
    "agreeableness",
    "emotionalResilience",
    "honestyHumility",
    "adaptability",
  ];

  for (const dimension of dimensions) {
    const dimResponses = dimensionResponses[dimension] || [];
    
    // Calculate raw score based on responses
    let rawScore = 0;
    let totalWeight = 0;

    for (const response of dimResponses) {
      const weight = getQuestionWeight(response.question_type);
      const score = scoreResponse(response);
      
      rawScore += score * weight;
      totalWeight += weight;
    }

    // Normalize to 0-100 scale
    const normalizedScore = totalWeight > 0 
      ? Math.max(0, Math.min(100, (rawScore / totalWeight) * 10))
      : 50; // Default to middle if no responses

    // Calculate percentile (with some realistic variation)
    const percentile = calculatePercentile(normalizedScore, dimension);

    // Calculate confidence interval (narrower with more responses)
    const n = dimResponses.length;
    const se = Math.max(2, 10 / Math.sqrt(Math.max(1, n))); // Standard error
    const margin = 1.645 * se; // 90% confidence interval
    
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
  const weights: Record<string, number> = {
    likert: 1.0,
    forced_choice: 1.2,
    situational_judgment: 1.3,
    behavioral_frequency: 1.5,
  };
  return weights[questionType] || 1.0;
}

function scoreResponse(response: QuestionResponse): number {
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

  if (question_type === "forced_choice") {
    // Parse JSON string if needed
    let parsed: any = responseValue;
    if (typeof responseValue === "string") {
      try {
        parsed = JSON.parse(responseValue);
      } catch {
        // If it's a simple string selection, score based on position
        if (responseValue === "A" || responseValue === "1") return 8;
        if (responseValue === "B" || responseValue === "2") return 5;
        if (responseValue === "C" || responseValue === "3") return 2;
        return 5;
      }
    }
    
    if (typeof parsed === "object" && parsed !== null) {
      // Most = high score, least = low score
      if (parsed.most) return 9;
      if (parsed.least) return 1;
      // Handle ranked choices
      if (parsed.rank !== undefined) {
        return 10 - (parsed.rank * 3); // rank 1 = 7, rank 2 = 4, rank 3 = 1
      }
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
        return Math.max(1, 10 - (optionIndex * 2.5));
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

  return 5; // Default to middle score instead of 0
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
  const calibratedScore = ((rawScore - 50) * calibration.spread) + calibration.mean;
  
  // Ensure percentile stays within valid range
  return Math.max(1, Math.min(99, Math.round(calibratedScore)));
}

