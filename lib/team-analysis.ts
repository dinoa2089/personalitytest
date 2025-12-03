import type { DimensionScore, Dimension } from "@/types";

export interface TeamMember {
  id: string;
  name: string;
  role?: string;
  email?: string;
  scores: DimensionScore[];
}

export interface TeamAnalysis {
  averageProfile: DimensionScore[];
  diversity: number; // 0-100, how diverse the team is
  strengths: { dimension: string; score: number; description: string }[];
  gaps: { dimension: string; score: number; description: string }[];
  recommendations: string[];
}

export interface CompatibilityPair {
  member1: { id: string; name: string };
  member2: { id: string; name: string };
  compatibility: number; // 0-100
  dynamics: string;
}

interface DimensionInfo {
  name: string;
  highDesc: string;
  lowDesc: string;
}

const DIMENSION_INFO: Record<string, DimensionInfo> = {
  openness: {
    name: "Openness",
    highDesc: "Creative thinking and innovation",
    lowDesc: "Practical, tried-and-true approaches",
  },
  conscientiousness: {
    name: "Conscientiousness",
    highDesc: "Organization and follow-through",
    lowDesc: "Flexibility and quick pivots",
  },
  extraversion: {
    name: "Extraversion",
    highDesc: "External energy and collaboration",
    lowDesc: "Deep focus and independent work",
  },
  agreeableness: {
    name: "Agreeableness",
    highDesc: "Harmony and team cohesion",
    lowDesc: "Constructive challenge and debate",
  },
  emotionalResilience: {
    name: "Emotional Resilience",
    highDesc: "Stability under pressure",
    lowDesc: "Sensitivity and emotional depth",
  },
  honestyHumility: {
    name: "Honesty-Humility",
    highDesc: "Ethical grounding and fairness",
    lowDesc: "Competitive drive and ambition",
  },
  adaptability: {
    name: "Adaptability",
    highDesc: "Flexibility in changing conditions",
    lowDesc: "Consistency and reliability",
  },
};

const DIMENSIONS: Dimension[] = [
  "openness",
  "conscientiousness",
  "extraversion",
  "agreeableness",
  "emotionalResilience",
  "honestyHumility",
  "adaptability",
];

/**
 * Calculate team aggregate profile
 */
export function calculateTeamProfile(members: TeamMember[]): DimensionScore[] {
  if (members.length === 0) return [];

  return DIMENSIONS.map((dim) => {
    const scores = members
      .map((m) => m.scores.find((s) => s.dimension === dim)?.percentile ?? 50)
      .filter((s) => s !== null);

    const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
    const stdDev = Math.sqrt(
      scores.reduce((sum, s) => sum + (s - avg) ** 2, 0) / scores.length
    );

    return {
      dimension: dim,
      percentile: Math.round(avg),
      raw_score: avg / 100,
      confidence_interval: [
        Math.max(0, Math.round(avg - stdDev)),
        Math.min(100, Math.round(avg + stdDev)),
      ] as [number, number],
    };
  });
}

/**
 * Analyze team strengths, gaps, and diversity
 */
export function analyzeTeam(members: TeamMember[]): TeamAnalysis {
  const avgProfile = calculateTeamProfile(members);

  if (avgProfile.length === 0) {
    return {
      averageProfile: [],
      diversity: 0,
      strengths: [],
      gaps: [],
      recommendations: ["Add team members to see analysis."],
    };
  }

  // Calculate diversity (standard deviation of scores across team)
  let totalVariance = 0;
  avgProfile.forEach((dim) => {
    const scores = members.map(
      (m) => m.scores.find((s) => s.dimension === dim.dimension)?.percentile ?? 50
    );
    const variance =
      scores.reduce((sum, s) => sum + (s - dim.percentile) ** 2, 0) /
      scores.length;
    totalVariance += variance;
  });
  const diversity = Math.min(100, Math.sqrt(totalVariance / avgProfile.length) * 3);

  // Identify strengths (high scores) and gaps (low scores)
  const sorted = [...avgProfile].sort((a, b) => b.percentile - a.percentile);

  const strengths = sorted.slice(0, 3).map((dim) => ({
    dimension: dim.dimension,
    score: dim.percentile,
    description: DIMENSION_INFO[dim.dimension]?.highDesc || "",
  }));

  const gaps = sorted
    .slice(-3)
    .reverse()
    .filter((dim) => dim.percentile < 50)
    .map((dim) => ({
      dimension: dim.dimension,
      score: dim.percentile,
      description: DIMENSION_INFO[dim.dimension]?.lowDesc || "",
    }));

  // Generate recommendations
  const recommendations: string[] = [];

  gaps.forEach((gap) => {
    if (gap.score < 40) {
      recommendations.push(
        `Consider adding someone with high ${DIMENSION_INFO[gap.dimension]?.name} to balance the team.`
      );
    }
  });

  if (diversity < 30) {
    recommendations.push(
      "Team is quite homogeneous. Adding diverse personality types could improve problem-solving."
    );
  }

  if (diversity > 70) {
    recommendations.push(
      "High diversity can lead to conflict. Establish clear communication norms."
    );
  }

  if (members.length < 3) {
    recommendations.push(
      "Add more team members for more accurate team dynamics analysis."
    );
  }

  return {
    averageProfile: avgProfile,
    diversity: Math.round(diversity),
    strengths,
    gaps,
    recommendations,
  };
}

/**
 * Calculate compatibility between two team members
 */
function calculatePairCompatibility(
  member1: TeamMember,
  member2: TeamMember
): number {
  let totalCompat = 0;
  let count = 0;

  member1.scores.forEach((s1) => {
    const s2 = member2.scores.find((s) => s.dimension === s1.dimension);
    if (s2) {
      // Some dimensions work better with similarity, others with complementarity
      const complementaryDims = ["extraversion", "openness"];
      const diff = Math.abs(s1.percentile - s2.percentile);

      if (complementaryDims.includes(s1.dimension)) {
        // Moderate difference is good (complementary)
        totalCompat += 100 - Math.abs(diff - 30) * 2;
      } else {
        // Similarity is better
        totalCompat += 100 - diff;
      }
      count++;
    }
  });

  return count > 0 ? Math.round(totalCompat / count) : 50;
}

/**
 * Generate compatibility matrix for all team members
 */
export function calculateCompatibilityMatrix(
  members: TeamMember[]
): CompatibilityPair[] {
  const pairs: CompatibilityPair[] = [];

  for (let i = 0; i < members.length; i++) {
    for (let j = i + 1; j < members.length; j++) {
      const compat = calculatePairCompatibility(members[i], members[j]);

      let dynamics = "Balanced working relationship";
      if (compat >= 85) dynamics = "Natural collaboration partners";
      else if (compat >= 70) dynamics = "Good complementary skills";
      else if (compat < 50) dynamics = "May need clear role boundaries";

      pairs.push({
        member1: { id: members[i].id, name: members[i].name },
        member2: { id: members[j].id, name: members[j].name },
        compatibility: compat,
        dynamics,
      });
    }
  }

  return pairs.sort((a, b) => b.compatibility - a.compatibility);
}

/**
 * Get dimension display name
 */
export function getDimensionName(dimension: string): string {
  return DIMENSION_INFO[dimension]?.name || dimension;
}

/**
 * Get recommended archetypes to complement the team
 */
export function getRecommendedArchetypes(
  analysis: TeamAnalysis
): { archetype: string; reason: string }[] {
  const recommendations: { archetype: string; reason: string }[] = [];

  // Check for gaps and recommend archetypes that would fill them
  analysis.gaps.forEach((gap) => {
    if (gap.dimension === "openness" && gap.score < 40) {
      recommendations.push({
        archetype: "Innovator",
        reason: "Would bring creative thinking and innovation to balance the team",
      });
    }
    if (gap.dimension === "conscientiousness" && gap.score < 40) {
      recommendations.push({
        archetype: "Strategist",
        reason: "Would add planning and organization skills",
      });
    }
    if (gap.dimension === "extraversion" && gap.score < 40) {
      recommendations.push({
        archetype: "Catalyst",
        reason: "Would bring external energy and collaboration",
      });
    }
    if (gap.dimension === "agreeableness" && gap.score < 40) {
      recommendations.push({
        archetype: "Connector",
        reason: "Would improve team harmony and cohesion",
      });
    }
    if (gap.dimension === "emotionalResilience" && gap.score < 40) {
      recommendations.push({
        archetype: "Stabilizer",
        reason: "Would add stability under pressure",
      });
    }
  });

  return recommendations.slice(0, 3);
}

/**
 * Calculate team synergy score (0-100)
 */
export function calculateTeamSynergy(members: TeamMember[]): number {
  if (members.length < 2) return 50;

  const compatibility = calculateCompatibilityMatrix(members);
  if (compatibility.length === 0) return 50;

  const avgCompatibility =
    compatibility.reduce((sum, pair) => sum + pair.compatibility, 0) /
    compatibility.length;

  return Math.round(avgCompatibility);
}

/**
 * Get color for compatibility score
 */
export function getCompatibilityColor(score: number): string {
  if (score >= 80) return "text-green-600";
  if (score >= 65) return "text-blue-600";
  if (score >= 50) return "text-amber-600";
  return "text-red-600";
}

/**
 * Get background color for compatibility score
 */
export function getCompatibilityBgColor(score: number): string {
  if (score >= 80) return "bg-green-500/20";
  if (score >= 65) return "bg-blue-500/20";
  if (score >= 50) return "bg-amber-500/20";
  return "bg-red-500/20";
}

