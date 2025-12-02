import type { DimensionScore } from "@/types";

export type CompatibilityMode = 'work' | 'romantic' | 'friendship' | 'parent' | 'child';

export interface CompatibilityResult {
  mode: CompatibilityMode;
  overallScore: number;
  categories: {
    name: string;
    score: number;
    description: string;
  }[];
  strengths: string[];
  challenges: string[];
  tips: string[];
}

// Dimension weights for each compatibility mode
const modeWeights: Record<CompatibilityMode, Record<string, { similarity: number; complementary: number }>> = {
  work: {
    conscientiousness: { similarity: 0.8, complementary: 0.2 },
    agreeableness: { similarity: 0.6, complementary: 0.4 },
    openness: { similarity: 0.5, complementary: 0.5 },
    extraversion: { similarity: 0.3, complementary: 0.7 },
    emotionalResilience: { similarity: 0.7, complementary: 0.3 },
    honestyHumility: { similarity: 0.9, complementary: 0.1 },
    adaptability: { similarity: 0.6, complementary: 0.4 },
  },
  romantic: {
    conscientiousness: { similarity: 0.7, complementary: 0.3 },
    agreeableness: { similarity: 0.8, complementary: 0.2 },
    openness: { similarity: 0.6, complementary: 0.4 },
    extraversion: { similarity: 0.4, complementary: 0.6 },
    emotionalResilience: { similarity: 0.5, complementary: 0.5 },
    honestyHumility: { similarity: 0.9, complementary: 0.1 },
    adaptability: { similarity: 0.6, complementary: 0.4 },
  },
  friendship: {
    conscientiousness: { similarity: 0.5, complementary: 0.5 },
    agreeableness: { similarity: 0.7, complementary: 0.3 },
    openness: { similarity: 0.8, complementary: 0.2 },
    extraversion: { similarity: 0.6, complementary: 0.4 },
    emotionalResilience: { similarity: 0.4, complementary: 0.6 },
    honestyHumility: { similarity: 0.7, complementary: 0.3 },
    adaptability: { similarity: 0.7, complementary: 0.3 },
  },
  parent: {
    conscientiousness: { similarity: 0.3, complementary: 0.7 },
    agreeableness: { similarity: 0.6, complementary: 0.4 },
    openness: { similarity: 0.4, complementary: 0.6 },
    extraversion: { similarity: 0.5, complementary: 0.5 },
    emotionalResilience: { similarity: 0.8, complementary: 0.2 },
    honestyHumility: { similarity: 0.7, complementary: 0.3 },
    adaptability: { similarity: 0.7, complementary: 0.3 },
  },
  child: {
    conscientiousness: { similarity: 0.4, complementary: 0.6 },
    agreeableness: { similarity: 0.5, complementary: 0.5 },
    openness: { similarity: 0.6, complementary: 0.4 },
    extraversion: { similarity: 0.5, complementary: 0.5 },
    emotionalResilience: { similarity: 0.6, complementary: 0.4 },
    honestyHumility: { similarity: 0.7, complementary: 0.3 },
    adaptability: { similarity: 0.6, complementary: 0.4 },
  },
};

const modeLabels: Record<CompatibilityMode, { title: string; description: string }> = {
  work: {
    title: "Work Partnership",
    description: "How well you collaborate professionally",
  },
  romantic: {
    title: "Romantic Relationship",
    description: "Your romantic and intimate compatibility",
  },
  friendship: {
    title: "Friendship",
    description: "How well you connect as friends",
  },
  parent: {
    title: "As a Parent",
    description: "Your parenting style compatibility",
  },
  child: {
    title: "Parent-Child Dynamic",
    description: "How you relate as parent and child",
  },
};

const dimensionLabels: Record<string, string> = {
  openness: "Openness",
  conscientiousness: "Conscientiousness",
  extraversion: "Extraversion",
  agreeableness: "Agreeableness",
  emotionalResilience: "Emotional Resilience",
  honestyHumility: "Honesty-Humility",
  adaptability: "Adaptability",
};

/**
 * Calculate compatibility between two sets of scores
 */
export function calculateCompatibility(
  scores1: DimensionScore[],
  scores2: DimensionScore[],
  mode: CompatibilityMode
): CompatibilityResult {
  const weights = modeWeights[mode];
  const modeInfo = modeLabels[mode];
  
  // Create score maps
  const map1 = scores1.reduce((acc, s) => ({ ...acc, [s.dimension]: s.percentile }), {} as Record<string, number>);
  const map2 = scores2.reduce((acc, s) => ({ ...acc, [s.dimension]: s.percentile }), {} as Record<string, number>);
  
  const categories: CompatibilityResult['categories'] = [];
  let totalWeightedScore = 0;
  let totalWeight = 0;
  
  // Calculate each dimension's compatibility
  for (const [dimension, weight] of Object.entries(weights)) {
    const score1 = map1[dimension] || 50;
    const score2 = map2[dimension] || 50;
    
    // Similarity score: how close the scores are (0-100)
    const difference = Math.abs(score1 - score2);
    const similarityScore = 100 - difference;
    
    // Complementary score: how well they balance each other
    // High complementary when one is high and one is low/moderate
    const complementaryScore = Math.min(100, 50 + Math.abs(score1 - 50) + Math.abs(score2 - 50) / 2);
    
    // Weighted combination
    const dimScore = (similarityScore * weight.similarity + complementaryScore * weight.complementary);
    
    categories.push({
      name: dimensionLabels[dimension] || dimension,
      score: Math.round(dimScore),
      description: getDimensionCompatibilityDescription(dimension, score1, score2, mode),
    });
    
    totalWeightedScore += dimScore;
    totalWeight += 1;
  }
  
  const overallScore = Math.round(totalWeightedScore / totalWeight);
  
  // Generate strengths and challenges
  const sortedCategories = [...categories].sort((a, b) => b.score - a.score);
  const strengths = sortedCategories.slice(0, 3).map(c => 
    getStrengthStatement(c.name, mode)
  );
  const challenges = sortedCategories.slice(-2).map(c => 
    getChallengeStatement(c.name, mode)
  );
  
  const tips = generateTips(map1, map2, mode);
  
  return {
    mode,
    overallScore,
    categories,
    strengths,
    challenges,
    tips,
  };
}

function getDimensionCompatibilityDescription(
  dimension: string,
  score1: number,
  score2: number,
  mode: CompatibilityMode
): string {
  const diff = Math.abs(score1 - score2);
  const avgScore = (score1 + score2) / 2;
  
  if (diff < 15) {
    return `You share similar levels of ${dimensionLabels[dimension]?.toLowerCase() || dimension}, creating natural understanding.`;
  } else if (diff < 30) {
    return `Some differences in ${dimensionLabels[dimension]?.toLowerCase() || dimension} can create growth opportunities.`;
  } else {
    return `Notable differences here may require conscious communication and compromise.`;
  }
}

function getStrengthStatement(categoryName: string, mode: CompatibilityMode): string {
  const modeStrengths: Record<CompatibilityMode, Record<string, string>> = {
    work: {
      "Conscientiousness": "You'll both meet deadlines and maintain high standards together",
      "Agreeableness": "Collaboration comes naturally, with mutual respect and support",
      "Openness": "You'll generate creative ideas and embrace innovation together",
      "Extraversion": "You balance each other's energy in team settings",
      "Emotional Resilience": "You handle workplace stress without dragging each other down",
      "Honesty-Humility": "Trust and ethical alignment form a strong foundation",
      "Adaptability": "You navigate change and pivot effectively as a team",
    },
    romantic: {
      "Conscientiousness": "You share similar values around responsibility and planning",
      "Agreeableness": "Harmony and care for each other come naturally",
      "Openness": "You explore new experiences and grow together",
      "Extraversion": "Your social energy is well-balanced",
      "Emotional Resilience": "You support each other through emotional challenges",
      "Honesty-Humility": "Deep trust and authenticity strengthen your bond",
      "Adaptability": "You handle life changes as a flexible, unified team",
    },
    friendship: {
      "Conscientiousness": "You're reliable friends who follow through on plans",
      "Agreeableness": "Your friendship is built on mutual care and support",
      "Openness": "You enjoy exploring new ideas and experiences together",
      "Extraversion": "You match each other's social energy well",
      "Emotional Resilience": "You're there for each other without drama",
      "Honesty-Humility": "Authenticity keeps your friendship genuine",
      "Adaptability": "Your friendship evolves naturally with life changes",
    },
    parent: {
      "Conscientiousness": "You create consistent structure and expectations",
      "Agreeableness": "Nurturing comes naturally to your parenting style",
      "Openness": "You encourage curiosity and exploration",
      "Extraversion": "You balance activity and quiet time well",
      "Emotional Resilience": "You model healthy emotional regulation",
      "Honesty-Humility": "You teach values through authentic example",
      "Adaptability": "You adjust your parenting as your child grows",
    },
    child: {
      "Conscientiousness": "You understand each other's need for structure",
      "Agreeableness": "Mutual care creates a supportive dynamic",
      "Openness": "You share curiosity and learning together",
      "Extraversion": "Your energy levels complement each other",
      "Emotional Resilience": "You support each other's emotional needs",
      "Honesty-Humility": "Honesty strengthens your relationship",
      "Adaptability": "You grow and change together naturally",
    },
  };
  
  return modeStrengths[mode][categoryName] || `Strong ${categoryName.toLowerCase()} compatibility`;
}

function getChallengeStatement(categoryName: string, mode: CompatibilityMode): string {
  const challenges: Record<string, string> = {
    "Conscientiousness": "Different approaches to planning and organization may cause friction",
    "Agreeableness": "Finding the balance between directness and harmony takes effort",
    "Openness": "One may want more novelty while the other prefers familiarity",
    "Extraversion": "Energy level differences may require compromise on social activities",
    "Emotional Resilience": "Supporting each other through stress may need extra attention",
    "Honesty-Humility": "Different comfort levels with directness may need navigation",
    "Adaptability": "Different comfort with change may require patience",
  };
  
  return challenges[categoryName] || `${categoryName} differences may require attention`;
}

function generateTips(
  map1: Record<string, number>,
  map2: Record<string, number>,
  mode: CompatibilityMode
): string[] {
  const tips: string[] = [];
  
  // Extraversion difference tips
  const extraDiff = Math.abs((map1.extraversion || 50) - (map2.extraversion || 50));
  if (extraDiff > 25) {
    tips.push("Schedule both social activities and quiet time to meet both needs");
  }
  
  // Conscientiousness difference tips
  const consDiff = Math.abs((map1.conscientiousness || 50) - (map2.conscientiousness || 50));
  if (consDiff > 25) {
    tips.push("Be explicit about expectations and timelines to avoid frustration");
  }
  
  // Openness difference tips
  const openDiff = Math.abs((map1.openness || 50) - (map2.openness || 50));
  if (openDiff > 25) {
    tips.push("Alternate between trying new things and enjoying familiar favorites");
  }
  
  // Emotional resilience tips
  const emotionalDiff = Math.abs((map1.emotionalResilience || 50) - (map2.emotionalResilience || 50));
  if (emotionalDiff > 25) {
    tips.push("The more resilient partner should practice patience during emotional moments");
  }
  
  // Default tips based on mode
  if (tips.length < 3) {
    const modeTips: Record<CompatibilityMode, string[]> = {
      work: [
        "Set clear communication protocols for different types of decisions",
        "Leverage each other's strengths by dividing responsibilities accordingly",
        "Schedule regular check-ins to stay aligned on priorities",
      ],
      romantic: [
        "Practice active listening without immediately problem-solving",
        "Express appreciation for each other's unique qualities regularly",
        "Create shared rituals that honor both of your preferences",
      ],
      friendship: [
        "Accept that different doesn't mean wrong",
        "Celebrate what makes each of you unique",
        "Be proactive about making plans that work for both of you",
      ],
      parent: [
        "Present a united front even when you disagree privately",
        "Adapt your communication style to your child's needs",
        "Model the behavior you want to see",
      ],
      child: [
        "Communicate openly about your different perspectives",
        "Find common ground activities you both enjoy",
        "Respect boundaries while maintaining connection",
      ],
    };
    tips.push(...modeTips[mode].slice(0, 3 - tips.length));
  }
  
  return tips.slice(0, 3);
}

/**
 * Generate a compatibility invitation link
 */
export function generateCompatibilityLink(sessionId: string): string {
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  return `${baseUrl}/compare?with=${sessionId}`;
}

/**
 * Get the mode label information
 */
export function getModeInfo(mode: CompatibilityMode) {
  return modeLabels[mode];
}

/**
 * Get all available modes
 */
export function getAllModes(): { mode: CompatibilityMode; title: string; description: string }[] {
  return Object.entries(modeLabels).map(([mode, info]) => ({
    mode: mode as CompatibilityMode,
    ...info,
  }));
}

