/**
 * Mock scoring function for development/testing when Python API is not available
 * Generates realistic dimensional scores with percentiles and confidence intervals
 * 
 * Uses IRT-informed weighting:
 * - effective_weight = type_weight × discrimination
 * - score = sum(response × effective_weight) / sum(effective_weight)
 * - confidence_margin = base_margin / sqrt(sum(discrimination²))
 * 
 * Also tracks MBTI dimensions directly from framework_tags for accurate T/F calculation
 */
import type { QuestionResponse, DimensionScore, ForcedChoiceOption, Question, Dimension, FrameworkMappings } from "@/types";

// Import mock questions to access forced-choice options with dimension mappings
import { mockQuestions } from "./mock-questions";

// MBTI Dimension identifiers
const MBTI_DIMENSIONS = ['mbti_ei', 'mbti_sn', 'mbti_tf', 'mbti_jp'] as const;
type MbtiDimension = typeof MBTI_DIMENSIONS[number];

// Enneagram type identifiers
const ENNEAGRAM_TYPES = ['enneagram_1', 'enneagram_2', 'enneagram_3', 'enneagram_4', 
                         'enneagram_5', 'enneagram_6', 'enneagram_7', 'enneagram_8', 
                         'enneagram_9'] as const;
type EnneagramType = typeof ENNEAGRAM_TYPES[number];

/**
 * MBTI dimension score with direct calculation from framework-tagged questions
 */
export interface MbtiDimensionScore {
  dimension: MbtiDimension;
  score: number;           // 0-100, where 50 is neutral
  letter: string;          // The determined letter (E/I, S/N, T/F, J/P)
  confidence: number;      // 0-100 confidence in this determination
  responseCount: number;   // Number of questions answered for this dimension
}

/**
 * Enneagram type score with direct calculation from framework-tagged questions
 */
export interface EnneagramTypeScore {
  type: number;            // 1-9
  score: number;           // 0-100 affinity score
  responseCount: number;   // Number of questions answered for this type
}

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
 * Now also tracks MBTI dimensions directly from framework_tags
 */
export function mockCalculateScores(
  responses: (QuestionResponse | ResponseWithMetadata)[],
  sessionId: string
): { dimensional_scores: DimensionScore[]; mbti_scores?: MbtiDimensionScore[]; enneagram_scores?: EnneagramTypeScore[]; frameworks?: FrameworkMappings; completed: boolean } {
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

  // Initialize MBTI dimension accumulators
  const mbtiScores: Record<string, {
    totalScore: number;
    totalWeight: number;
    count: number;
  }> = {};
  
  for (const mbtiDim of MBTI_DIMENSIONS) {
    mbtiScores[mbtiDim] = { totalScore: 0, totalWeight: 0, count: 0 };
  }

  // Initialize Enneagram type accumulators
  const enneagramScores: Record<string, {
    totalScore: number;
    totalWeight: number;
    count: number;
  }> = {};
  
  for (const ennType of ENNEAGRAM_TYPES) {
    enneagramScores[ennType] = { totalScore: 0, totalWeight: 0, count: 0 };
  }

  // Process each response
  for (const response of responses) {
    // Get the question to access framework_tags and other metadata
    const question = getQuestionById(response.question_id);
    
    // Get discrimination from response metadata or question lookup
    let discrimination = 1.0;
    if ('discrimination' in response && response.discrimination !== undefined) {
      discrimination = response.discrimination;
    } else if (question?.discrimination !== undefined) {
      discrimination = question.discrimination;
    }

    // Calculate effective weight using IRT formula
    const effectiveWeight = getEffectiveWeight(response.question_type, discrimination);

    // Check for MBTI framework tags and score them directly
    const frameworkTags = question?.framework_tags || (response as any).framework_tags || [];
    
    // Get reverse_scored from response (enriched) or question
    const isReversed = (response as any).reverse_scored ?? question?.reverse_scored ?? false;
    
    for (const mbtiDim of MBTI_DIMENSIONS) {
      if (frameworkTags.includes(mbtiDim)) {
        // Score this response for the MBTI dimension
        let mbtiScore = scoreSimpleResponse(response);
        
        // CRITICAL: Apply reverse scoring for MBTI dimensions
        // If a question is reverse-scored, LOW answer should mean HIGH on the target scale
        // e.g., "I find it stressful when routine is disrupted" reverse=true + answer 3 (low)
        //       should contribute HIGH to Judging (low stress = organized/structured)
        if (isReversed) {
          mbtiScore = 10 - mbtiScore; // Invert the 0-10 scale
        }
        
        mbtiScores[mbtiDim].totalScore += mbtiScore * effectiveWeight;
        mbtiScores[mbtiDim].totalWeight += effectiveWeight;
        mbtiScores[mbtiDim].count += 1;
      }
    }

    // Check for Enneagram framework tags and score them directly
    for (const ennType of ENNEAGRAM_TYPES) {
      if (frameworkTags.includes(ennType)) {
        // Score this response for the Enneagram type
        let ennScore = scoreSimpleResponse(response);
        
        // Apply reverse scoring for Enneagram dimensions too
        if (isReversed) {
          ennScore = 10 - ennScore;
        }
        
        enneagramScores[ennType].totalScore += ennScore * effectiveWeight;
        enneagramScores[ennType].totalWeight += effectiveWeight;
        enneagramScores[ennType].count += 1;
      }
    }

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
        let score = scoreSimpleResponse(response);
        // CRITICAL: Apply reverse scoring for PRISM dimensions
        if (isReversed) {
          score = 10 - score;
        }
        const dim = response.dimension;
        dimensionScores[dim].totalScore += score * effectiveWeight;
        dimensionScores[dim].totalWeight += effectiveWeight;
        dimensionScores[dim].count += 1;
        dimensionScores[dim].sumDiscriminationSquared += discrimination * discrimination;
      }
    } else {
      // Non-forced-choice: score to primary dimension
      let score = scoreSimpleResponse(response);
      // CRITICAL: Apply reverse scoring for PRISM dimensions
      if (isReversed) {
        score = 10 - score;
      }
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

  // Calculate MBTI dimension scores
  const mbti_dimension_scores: MbtiDimensionScore[] = [];
  
  // Helper to determine letter and confidence for each MBTI dimension
  const getMbtiLetter = (dim: MbtiDimension, score: number): { letter: string; confidence: number } => {
    // Score is 0-100 where 50 is neutral
    // For mbti_tf: high score = Thinking, low score = Feeling
    // For mbti_sn: high score = Sensing, low score = iNtuition  
    // For mbti_jp: high score = Judging, low score = Perceiving
    // For mbti_ei: high score = Extraversion, low score = Introversion
    const distance = Math.abs(score - 50);
    const confidence = Math.min(100, 50 + distance); // Stronger preference = higher confidence
    
    switch (dim) {
      case 'mbti_ei':
        return { letter: score >= 50 ? 'E' : 'I', confidence };
      case 'mbti_sn':
        return { letter: score >= 50 ? 'S' : 'N', confidence };
      case 'mbti_tf':
        return { letter: score >= 50 ? 'T' : 'F', confidence };
      case 'mbti_jp':
        return { letter: score >= 50 ? 'J' : 'P', confidence };
      default:
        return { letter: '?', confidence: 0 };
    }
  };

  for (const mbtiDim of MBTI_DIMENSIONS) {
    const data = mbtiScores[mbtiDim];
    
    // If we have direct responses, use them; otherwise use PRISM fallback
    let normalizedScore = 50; // Default to neutral
    
    if (data.totalWeight > 0) {
      // We have direct MBTI dimension responses
      normalizedScore = Math.max(0, Math.min(100, (data.totalScore / data.totalWeight) * 10));
    } else {
      // Fallback to PRISM mapping (with improvements)
      const prismScores = dimensional_scores.reduce(
        (acc, s) => ({ ...acc, [s.dimension]: s.percentile }),
        {} as Record<string, number>
      );
      
      switch (mbtiDim) {
        case 'mbti_ei':
          normalizedScore = prismScores.extraversion || 50;
          break;
        case 'mbti_sn':
          // Invert openness: high openness = N (low S), so we invert for S scale
          normalizedScore = 100 - (prismScores.openness || 50);
          break;
        case 'mbti_tf':
          // Improved T/F: invert agreeableness, factor in emotional resilience
          // High agreeableness ≠ Feeling; low agreeableness leans toward T
          // Emotional resilience also correlates with Thinking
          const agreeableness = prismScores.agreeableness || 50;
          const resilience = prismScores.emotionalResilience || 50;
          normalizedScore = (100 - agreeableness) * 0.6 + resilience * 0.4;
          break;
        case 'mbti_jp':
          // Conscientiousness for J, invert adaptability for P
          // High conscientiousness AND low adaptability = strong J
          const conscientiousness = prismScores.conscientiousness || 50;
          const adaptability = prismScores.adaptability || 50;
          normalizedScore = conscientiousness * 0.6 + (100 - adaptability) * 0.4;
          break;
      }
    }
    
    const { letter, confidence } = getMbtiLetter(mbtiDim, normalizedScore);
    
    mbti_dimension_scores.push({
      dimension: mbtiDim,
      score: normalizedScore,
      letter,
      confidence,
      responseCount: data.count,
    });
  }

  // Calculate Enneagram type scores
  const enneagram_type_scores: EnneagramTypeScore[] = [];
  
  for (const ennType of ENNEAGRAM_TYPES) {
    const data = enneagramScores[ennType];
    const typeNum = parseInt(ennType.replace('enneagram_', ''));
    
    let normalizedScore = 50; // Default to neutral
    
    if (data.totalWeight > 0) {
      // We have direct Enneagram type responses
      normalizedScore = Math.max(0, Math.min(100, (data.totalScore / data.totalWeight) * 10));
    }
    
    enneagram_type_scores.push({
      type: typeNum,
      score: normalizedScore,
      responseCount: data.count,
    });
  }

  // Build the frameworks object in the format expected by frontend
  const mbtiType = mbti_dimension_scores.map(s => s.letter).join('');
  const avgMbtiConfidence = mbti_dimension_scores.reduce((sum, s) => sum + s.confidence, 0) / 4;
  const borderlineCount = mbti_dimension_scores.filter(s => Math.abs(s.score - 50) < 5).length;
  const directCount = mbti_dimension_scores.filter(s => s.responseCount > 0).length;

  const frameworks = {
    mbti: {
      type: mbtiType,
      confidence: Math.round(avgMbtiConfidence),
      borderline_count: borderlineCount,
      direct_question_count: directCount,
      dimensions: {
        "E/I": {
          value: mbti_dimension_scores.find(s => s.dimension === 'mbti_ei')?.letter || 'E',
          confidence: Math.round(mbti_dimension_scores.find(s => s.dimension === 'mbti_ei')?.confidence || 50),
          score: Math.round(mbti_dimension_scores.find(s => s.dimension === 'mbti_ei')?.score || 50),
          is_direct: (mbti_dimension_scores.find(s => s.dimension === 'mbti_ei')?.responseCount || 0) > 0,
          borderline: Math.abs((mbti_dimension_scores.find(s => s.dimension === 'mbti_ei')?.score || 50) - 50) < 5,
        },
        "S/N": {
          value: mbti_dimension_scores.find(s => s.dimension === 'mbti_sn')?.letter || 'N',
          confidence: Math.round(mbti_dimension_scores.find(s => s.dimension === 'mbti_sn')?.confidence || 50),
          score: Math.round(mbti_dimension_scores.find(s => s.dimension === 'mbti_sn')?.score || 50),
          is_direct: (mbti_dimension_scores.find(s => s.dimension === 'mbti_sn')?.responseCount || 0) > 0,
          borderline: Math.abs((mbti_dimension_scores.find(s => s.dimension === 'mbti_sn')?.score || 50) - 50) < 5,
        },
        "T/F": {
          value: mbti_dimension_scores.find(s => s.dimension === 'mbti_tf')?.letter || 'T',
          confidence: Math.round(mbti_dimension_scores.find(s => s.dimension === 'mbti_tf')?.confidence || 50),
          score: Math.round(mbti_dimension_scores.find(s => s.dimension === 'mbti_tf')?.score || 50),
          is_direct: (mbti_dimension_scores.find(s => s.dimension === 'mbti_tf')?.responseCount || 0) > 0,
          borderline: Math.abs((mbti_dimension_scores.find(s => s.dimension === 'mbti_tf')?.score || 50) - 50) < 5,
        },
        "J/P": {
          value: mbti_dimension_scores.find(s => s.dimension === 'mbti_jp')?.letter || 'J',
          confidence: Math.round(mbti_dimension_scores.find(s => s.dimension === 'mbti_jp')?.confidence || 50),
          score: Math.round(mbti_dimension_scores.find(s => s.dimension === 'mbti_jp')?.score || 50),
          is_direct: (mbti_dimension_scores.find(s => s.dimension === 'mbti_jp')?.responseCount || 0) > 0,
          borderline: Math.abs((mbti_dimension_scores.find(s => s.dimension === 'mbti_jp')?.score || 50) - 50) < 5,
        },
      },
      explanation: directCount >= 3
        ? `Your responses to MBTI-specific questions indicate an ${mbtiType} type with high confidence.`
        : `Your PRISM-7 dimensional scores suggest an ${mbtiType} type.${borderlineCount > 0 ? ` You have ${borderlineCount} dimension(s) near the middle.` : ''}`,
    },
    cliftonstrengths: buildCliftonStrengths(dimensional_scores),
    enneagram: buildEnneagramResult(enneagram_type_scores, dimensional_scores),
  };

  return {
    dimensional_scores,
    mbti_scores: mbti_dimension_scores,
    enneagram_scores: enneagram_type_scores,
    frameworks,
    completed: true,
  };
}

/**
 * Build CliftonStrengths from dimensional scores
 */
function buildCliftonStrengths(dimensional_scores: DimensionScore[]) {
  const scores: Record<string, number> = {};
  for (const s of dimensional_scores) {
    scores[s.dimension] = s.percentile;
  }

  const strategicThinking = (scores.openness || 50) * 0.6 + (scores.adaptability || 50) * 0.4;
  const executing = scores.conscientiousness || 50;
  const influencing = scores.extraversion || 50;
  const relationshipBuilding = scores.agreeableness || 50;

  const themes: Array<{ name: string; domain: string; score: number }> = [];

  if (strategicThinking > 60) {
    themes.push({ name: "Strategic", domain: "Strategic Thinking", score: strategicThinking });
    if (strategicThinking > 70) themes.push({ name: "Ideation", domain: "Strategic Thinking", score: strategicThinking * 0.9 });
    themes.push({ name: "Learner", domain: "Strategic Thinking", score: strategicThinking * 0.85 });
  }
  if (executing > 60) {
    themes.push({ name: "Achiever", domain: "Executing", score: executing });
    if (executing > 70) themes.push({ name: "Focus", domain: "Executing", score: executing * 0.9 });
    themes.push({ name: "Discipline", domain: "Executing", score: executing * 0.85 });
  }
  if (influencing > 60) {
    themes.push({ name: "Communication", domain: "Influencing", score: influencing });
    if (influencing > 70) themes.push({ name: "Woo", domain: "Influencing", score: influencing * 0.9 });
    themes.push({ name: "Activator", domain: "Influencing", score: influencing * 0.85 });
  }
  if (relationshipBuilding > 60) {
    themes.push({ name: "Empathy", domain: "Relationship Building", score: relationshipBuilding });
    if (relationshipBuilding > 70) themes.push({ name: "Harmony", domain: "Relationship Building", score: relationshipBuilding * 0.9 });
    themes.push({ name: "Developer", domain: "Relationship Building", score: relationshipBuilding * 0.85 });
  }

  themes.sort((a, b) => b.score - a.score);

  return {
    top_themes: themes.slice(0, 5),
    domains: {
      "Strategic Thinking": Math.round(strategicThinking),
      "Executing": Math.round(executing),
      "Influencing": Math.round(influencing),
      "Relationship Building": Math.round(relationshipBuilding),
    },
    explanation: "Based on your dimensional scores, these themes represent your natural talents.",
  };
}

/**
 * Build Enneagram result from type scores
 */
function buildEnneagramResult(enneagram_type_scores: EnneagramTypeScore[], dimensional_scores: DimensionScore[]) {
  const typeNames: Record<number, string> = {
    1: "Perfectionist", 2: "Helper", 3: "Achiever", 4: "Individualist",
    5: "Investigator", 6: "Loyalist", 7: "Enthusiast", 8: "Challenger", 9: "Peacemaker"
  };

  const scores: Record<string, number> = {};
  for (const s of dimensional_scores) {
    scores[s.dimension] = s.percentile;
  }

  // Calculate type probabilities using PRISM mapping (since mock may not have direct enneagram questions)
  const typeScores: Record<number, number> = {};
  
  // Type 1: Perfectionist
  typeScores[1] = ((scores.conscientiousness || 50) * 0.4 + (scores.honestyHumility || 50) * 0.4 + (100 - (scores.emotionalResilience || 50)) * 0.2);
  // Type 2: Helper
  typeScores[2] = ((scores.agreeableness || 50) * 0.5 + (scores.extraversion || 50) * 0.3 + (scores.honestyHumility || 50) * 0.2);
  // Type 3: Achiever
  typeScores[3] = ((scores.conscientiousness || 50) * 0.4 + (scores.extraversion || 50) * 0.3 + (scores.adaptability || 50) * 0.3);
  // Type 4: Individualist
  typeScores[4] = ((scores.openness || 50) * 0.5 + (100 - (scores.emotionalResilience || 50)) * 0.3 + (100 - (scores.extraversion || 50)) * 0.2);
  // Type 5: Investigator
  typeScores[5] = ((scores.openness || 50) * 0.5 + (100 - (scores.extraversion || 50)) * 0.3 + (scores.conscientiousness || 50) * 0.2);
  // Type 6: Loyalist
  typeScores[6] = ((scores.conscientiousness || 50) * 0.4 + (100 - (scores.emotionalResilience || 50)) * 0.3 + (scores.agreeableness || 50) * 0.3);
  // Type 7: Enthusiast
  typeScores[7] = ((scores.openness || 50) * 0.4 + (scores.extraversion || 50) * 0.4 + (scores.adaptability || 50) * 0.2);
  // Type 8: Challenger
  typeScores[8] = ((scores.extraversion || 50) * 0.4 + (scores.emotionalResilience || 50) * 0.3 + (100 - (scores.agreeableness || 50)) * 0.3);
  // Type 9: Peacemaker
  typeScores[9] = ((scores.agreeableness || 50) * 0.5 + (scores.adaptability || 50) * 0.3 + (100 - (scores.extraversion || 50)) * 0.2);

  // Blend with direct scores if available
  for (const es of enneagram_type_scores) {
    if (es.responseCount > 0) {
      typeScores[es.type] = (typeScores[es.type] * 0.3 + es.score * 0.7);
    }
  }

  const total = Object.values(typeScores).reduce((a, b) => a + b, 0);
  const all_probabilities: Record<number, number> = {};
  for (const [type, score] of Object.entries(typeScores)) {
    all_probabilities[parseInt(type)] = Math.round((score / total) * 100 * 10) / 10;
  }

  const sortedTypes = Object.entries(all_probabilities).sort((a, b) => b[1] - a[1]);
  const primary_type = parseInt(sortedTypes[0][0]);
  const primary_probability = sortedTypes[0][1];
  const second_type = parseInt(sortedTypes[1][0]);
  const second_probability = sortedTypes[1][1];

  // Determine wing
  const wing_candidates = [
    primary_type > 1 ? primary_type - 1 : 9,
    primary_type < 9 ? primary_type + 1 : 1
  ];
  const wing = all_probabilities[wing_candidates[0]] >= all_probabilities[wing_candidates[1]] 
    ? wing_candidates[0] : wing_candidates[1];

  const confidence_gap = primary_probability - second_probability;
  const directTypesScored = enneagram_type_scores.filter(s => s.responseCount > 0).length;
  const is_confident = confidence_gap > 5 || directTypesScored >= 5;

  return {
    primary_type,
    primary_probability,
    wing,
    wing_probability: all_probabilities[wing],
    all_probabilities,
    direct_types_scored: directTypesScored,
    confidence: {
      is_confident,
      gap_from_second: Math.round(confidence_gap * 10) / 10,
      second_type,
      second_probability,
      note: is_confident ? null : `Your scores suggest Type ${second_type} is also a strong possibility`,
    },
    explanation: directTypesScored >= 5
      ? `Your responses to Enneagram-specific questions indicate Type ${primary_type} (${typeNames[primary_type]}) with wing ${wing}.`
      : `Your dimensional pattern suggests Enneagram Type ${primary_type} (${typeNames[primary_type]}) with a ${typeNames[wing]} wing (w${wing}).`,
  };
}

function getQuestionWeight(questionType: string): number {
  return TYPE_WEIGHTS[questionType] || 1.0;
}

/**
 * Score a simple (non-forced-choice) response
 * Handles both raw values and {value: X} object format
 */
function scoreSimpleResponse(response: QuestionResponse): number {
  const { question_type, response: responseValue } = response;

  // Extract the actual value - responses can be raw values OR {value: X} objects
  let actualValue: any = responseValue;
  if (typeof responseValue === "object" && responseValue !== null && "value" in responseValue) {
    actualValue = (responseValue as any).value;
    // Handle nested JSON strings (e.g., {value: "{\"most\":\"...\",\"least\":\"...\"}"})
    if (typeof actualValue === "string") {
      try {
        const parsed = JSON.parse(actualValue);
        if (typeof parsed === "object" && parsed !== null) {
          actualValue = parsed;
        }
      } catch {
        // Not JSON, keep as string
      }
    }
  }

  if (question_type === "likert") {
    // Likert scale: 1-7, normalize to 0-10 for consistent scoring
    if (typeof actualValue === "number") {
      // Convert 1-7 scale to 0-10
      return ((actualValue - 1) / 6) * 10;
    }
    if (typeof actualValue === "string") {
      const num = parseFloat(actualValue);
      if (isNaN(num)) return 5; // Default to middle
      return ((num - 1) / 6) * 10;
    }
    return 5;
  }

  if (question_type === "situational_judgment") {
    // Situational judgment: typically string options describing actions
    // Score based on which option was selected
    if (typeof actualValue === "string") {
      // Options typically ordered from most to least aligned with the trait
      const optionIndex = parseInt(actualValue, 10);
      if (!isNaN(optionIndex)) {
        // Assume 3-4 options, first is highest trait expression
        return Math.max(1, 10 - optionIndex * 2.5);
      }
      // Letter-based options
      if (actualValue === "A" || actualValue.toLowerCase().includes("immediately") || actualValue.toLowerCase().includes("eagerly")) return 9;
      if (actualValue === "B" || actualValue.toLowerCase().includes("carefully") || actualValue.toLowerCase().includes("analyze")) return 7;
      if (actualValue === "C" || actualValue.toLowerCase().includes("wait") || actualValue.toLowerCase().includes("observe")) return 4;
      if (actualValue === "D" || actualValue.toLowerCase().includes("avoid") || actualValue.toLowerCase().includes("nothing")) return 2;
      // Generic string - try to infer from position if it matches option text
      return 5;
    }
    if (typeof actualValue === "number") {
      // Normalize to 0-10 scale
      return Math.max(0, Math.min(10, actualValue * 2));
    }
    return 5;
  }

  if (question_type === "behavioral_frequency") {
    // Behavioral frequency: 1-5 scale, normalize to 0-10
    if (typeof actualValue === "number") {
      // Check if it's 1-5 scale or 1-7 scale based on value range
      if (actualValue <= 5) {
        return ((actualValue - 1) / 4) * 10;
      } else {
        // Assume 1-7 scale
        return ((actualValue - 1) / 6) * 10;
      }
    }
    if (typeof actualValue === "string") {
      const num = parseFloat(actualValue);
      if (isNaN(num)) return 5;
      if (num <= 5) {
        return ((num - 1) / 4) * 10;
      } else {
        return ((num - 1) / 6) * 10;
      }
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
