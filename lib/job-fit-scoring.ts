import type { DimensionScore, Dimension } from "@/types";

export interface JobProfile {
  target_openness: number;
  target_conscientiousness: number;
  target_extraversion: number;
  target_agreeableness: number;
  target_emotional_resilience: number;
  target_honesty_humility: number;
  target_adaptability: number;
  weight_openness: number;
  weight_conscientiousness: number;
  weight_extraversion: number;
  weight_agreeableness: number;
  weight_emotional_resilience: number;
  weight_honesty_humility: number;
  weight_adaptability: number;
}

export interface DimensionFit {
  dimension: Dimension;
  label: string;
  candidateScore: number;
  targetScore: number;
  weight: number;
  difference: number; // Positive = above target, negative = below
  fit: number; // 0-100 fit score for this dimension
  rating: "excellent" | "good" | "fair" | "poor";
}

export interface JobFitResult {
  overallFit: number; // 0-100 weighted average
  rating: "excellent" | "good" | "fair" | "poor";
  breakdown: DimensionFit[];
  strengths: DimensionFit[]; // Top 3 best fits
  concerns: DimensionFit[]; // Bottom 3 / any poor fits
  summary: string; // One-sentence summary
}

type TargetKey = `target_${string}`;
type WeightKey = `weight_${string}`;

const DIMENSION_MAP: Record<
  Dimension,
  { targetKey: TargetKey; weightKey: WeightKey; label: string }
> = {
  openness: {
    targetKey: "target_openness",
    weightKey: "weight_openness",
    label: "Openness",
  },
  conscientiousness: {
    targetKey: "target_conscientiousness",
    weightKey: "weight_conscientiousness",
    label: "Conscientiousness",
  },
  extraversion: {
    targetKey: "target_extraversion",
    weightKey: "weight_extraversion",
    label: "Extraversion",
  },
  agreeableness: {
    targetKey: "target_agreeableness",
    weightKey: "weight_agreeableness",
    label: "Agreeableness",
  },
  emotionalResilience: {
    targetKey: "target_emotional_resilience",
    weightKey: "weight_emotional_resilience",
    label: "Emotional Resilience",
  },
  honestyHumility: {
    targetKey: "target_honesty_humility",
    weightKey: "weight_honesty_humility",
    label: "Honesty-Humility",
  },
  adaptability: {
    targetKey: "target_adaptability",
    weightKey: "weight_adaptability",
    label: "Adaptability",
  },
};

/**
 * Calculate how well a single dimension matches
 * Uses a Gaussian-like curve where:
 * - Exact match = 100
 * - ±10 points = ~90
 * - ±20 points = ~70
 * - ±30 points = ~50
 * - ±40+ points = <40
 */
function calculateDimensionFit(
  candidateScore: number,
  targetScore: number
): number {
  const difference = Math.abs(candidateScore - targetScore);

  // Gaussian decay: fit = 100 * exp(-(difference^2) / (2 * sigma^2))
  // sigma = 20 gives nice curve where ±20 = ~60%, ±30 = ~30%
  const sigma = 20;
  const fit = 100 * Math.exp(-(difference ** 2) / (2 * sigma ** 2));

  return Math.round(fit);
}

/**
 * Convert fit score to rating
 */
function getFitRating(fit: number): "excellent" | "good" | "fair" | "poor" {
  if (fit >= 85) return "excellent";
  if (fit >= 70) return "good";
  if (fit >= 50) return "fair";
  return "poor";
}

/**
 * Main scoring function
 */
export function calculateJobFit(
  candidateScores: DimensionScore[],
  jobProfile: JobProfile
): JobFitResult {
  // Create score map for easy lookup
  const scoreMap = candidateScores.reduce(
    (acc, score) => {
      acc[score.dimension] = score.percentile;
      return acc;
    },
    {} as Record<string, number>
  );

  // Calculate fit for each dimension
  const breakdown: DimensionFit[] = [];
  let weightedSum = 0;
  let totalWeight = 0;

  for (const [dimension, config] of Object.entries(DIMENSION_MAP)) {
    const candidateScore = scoreMap[dimension] ?? 50;
    const targetScore =
      (jobProfile[config.targetKey as keyof JobProfile] as number) ?? 50;
    const weight =
      (jobProfile[config.weightKey as keyof JobProfile] as number) ?? 1.0;

    const fit = calculateDimensionFit(candidateScore, targetScore);

    breakdown.push({
      dimension: dimension as Dimension,
      label: config.label,
      candidateScore,
      targetScore,
      weight,
      difference: candidateScore - targetScore,
      fit,
      rating: getFitRating(fit),
    });

    weightedSum += fit * weight;
    totalWeight += weight;
  }

  // Calculate overall weighted fit
  const overallFit = Math.round(weightedSum / totalWeight);

  // Sort by fit score for strengths/concerns
  const sorted = [...breakdown].sort((a, b) => b.fit - a.fit);
  const strengths = sorted.slice(0, 3).filter((d) => d.rating !== "poor");
  const concerns = sorted
    .slice(-3)
    .filter((d) => d.fit < 70)
    .reverse();

  // Generate summary
  const summary = generateSummary(overallFit, strengths, concerns);

  return {
    overallFit,
    rating: getFitRating(overallFit),
    breakdown,
    strengths,
    concerns,
    summary,
  };
}

function generateSummary(
  overallFit: number,
  strengths: DimensionFit[],
  concerns: DimensionFit[]
): string {
  const rating = getFitRating(overallFit);

  if (rating === "excellent") {
    return `Excellent fit (${overallFit}%). Candidate's personality aligns very well with role requirements.`;
  } else if (rating === "good") {
    const strengthLabels = strengths
      .slice(0, 2)
      .map((s) => s.label)
      .join(" and ");
    return `Good fit (${overallFit}%). Strong match in ${strengthLabels || "key areas"}.`;
  } else if (rating === "fair") {
    const concernLabels = concerns
      .slice(0, 2)
      .map((c) => c.label)
      .join(" and ");
    return `Fair fit (${overallFit}%). Consider exploring ${concernLabels || "some areas"} during interview.`;
  } else {
    return `Lower fit (${overallFit}%). Significant gaps in key areas. May not be ideal for this role.`;
  }
}

/**
 * Rank multiple candidates by fit score
 */
export function rankCandidates(
  candidates: Array<{ id: string; scores: DimensionScore[] }>,
  jobProfile: JobProfile
): Array<{ id: string; fit: JobFitResult; rank: number }> {
  const withFit = candidates.map((c) => ({
    id: c.id,
    fit: calculateJobFit(c.scores, jobProfile),
  }));

  // Sort by overall fit descending
  withFit.sort((a, b) => b.fit.overallFit - a.fit.overallFit);

  // Add rank
  return withFit.map((c, index) => ({
    ...c,
    rank: index + 1,
  }));
}

/**
 * Convert legacy ideal_profile format to JobProfile format
 * Handles both the new JobProfile format and legacy formats from existing code
 */
export function normalizeJobProfile(profile: Record<string, unknown>): JobProfile {
  // If already in correct format, return as-is
  if ("target_openness" in profile && "weight_openness" in profile) {
    return profile as unknown as JobProfile;
  }

  // Convert from legacy format (e.g., { openness: { target: 70, weight: 1.2 } })
  const normalized: JobProfile = {
    target_openness: 50,
    target_conscientiousness: 50,
    target_extraversion: 50,
    target_agreeableness: 50,
    target_emotional_resilience: 50,
    target_honesty_humility: 50,
    target_adaptability: 50,
    weight_openness: 1.0,
    weight_conscientiousness: 1.0,
    weight_extraversion: 1.0,
    weight_agreeableness: 1.0,
    weight_emotional_resilience: 1.0,
    weight_honesty_humility: 1.0,
    weight_adaptability: 1.0,
  };

  const dimensionMapping: Record<string, { targetKey: keyof JobProfile; weightKey: keyof JobProfile }> = {
    openness: { targetKey: "target_openness", weightKey: "weight_openness" },
    conscientiousness: { targetKey: "target_conscientiousness", weightKey: "weight_conscientiousness" },
    extraversion: { targetKey: "target_extraversion", weightKey: "weight_extraversion" },
    agreeableness: { targetKey: "target_agreeableness", weightKey: "weight_agreeableness" },
    emotionalResilience: { targetKey: "target_emotional_resilience", weightKey: "weight_emotional_resilience" },
    emotional_resilience: { targetKey: "target_emotional_resilience", weightKey: "weight_emotional_resilience" },
    honestyHumility: { targetKey: "target_honesty_humility", weightKey: "weight_honesty_humility" },
    honesty_humility: { targetKey: "target_honesty_humility", weightKey: "weight_honesty_humility" },
    adaptability: { targetKey: "target_adaptability", weightKey: "weight_adaptability" },
  };

  for (const [key, value] of Object.entries(profile)) {
    const mapping = dimensionMapping[key];
    if (mapping && typeof value === "object" && value !== null) {
      const dimValue = value as { target?: number; weight?: number; score?: number; importance?: number };
      if (dimValue.target !== undefined) {
        normalized[mapping.targetKey] = dimValue.target as number;
      } else if (dimValue.score !== undefined) {
        normalized[mapping.targetKey] = dimValue.score as number;
      }
      if (dimValue.weight !== undefined) {
        normalized[mapping.weightKey] = dimValue.weight as number;
      } else if (dimValue.importance !== undefined) {
        normalized[mapping.weightKey] = dimValue.importance as number;
      }
    }
  }

  return normalized;
}


