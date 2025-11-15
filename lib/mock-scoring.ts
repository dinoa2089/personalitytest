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
    // Likert scale: 1-7
    if (typeof responseValue === "number") {
      return responseValue;
    }
    if (typeof responseValue === "string") {
      const num = parseFloat(responseValue);
      return isNaN(num) ? 4 : num; // Default to middle
    }
    return 4;
  }

  if (question_type === "forced_choice") {
    // Parse JSON string if needed
    let parsed: any = responseValue;
    if (typeof responseValue === "string") {
      try {
        parsed = JSON.parse(responseValue);
      } catch {
        return 0;
      }
    }
    
    if (typeof parsed === "object" && parsed !== null) {
      // Most = +2, least = -1
      if (parsed.most) return 2.0;
      if (parsed.least) return -1.0;
    }
    return 0;
  }

  if (question_type === "situational_judgment") {
    // Map option selection to score (simplified)
    if (typeof responseValue === "string") {
      // First option = high, second = medium, third = low
      // This is simplified - real implementation would map per question
      return 2.0; // Default middle
    }
    if (typeof responseValue === "number") {
      return responseValue;
    }
    return 2.0;
  }

  if (question_type === "behavioral_frequency") {
    // Behavioral frequency: 1-5 scale
    if (typeof responseValue === "number") {
      return responseValue;
    }
    if (typeof responseValue === "string") {
      const num = parseFloat(responseValue);
      return isNaN(num) ? 3 : num; // Default to middle
    }
    return 3;
  }

  return 0;
}

function calculatePercentile(rawScore: number, dimension: string): number {
  // Generate realistic percentiles with some variation
  // In real implementation, this would use normative data
  
  // Add some dimension-specific variation
  const dimensionOffsets: Record<string, number> = {
    openness: 0,
    conscientiousness: 5,
    extraversion: -3,
    agreeableness: 2,
    emotionalResilience: -2,
    honestyHumility: 3,
    adaptability: -1,
  };

  const offset = dimensionOffsets[dimension] || 0;
  const basePercentile = rawScore + offset;
  
  // Add some realistic noise (±5%)
  const noise = (Math.random() - 0.5) * 10;
  
  return Math.max(0, Math.min(100, basePercentile + noise));
}

