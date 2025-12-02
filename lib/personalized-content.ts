import { 
  BookOpen, 
  Heart, 
  Briefcase, 
  Brain, 
  Users, 
  TrendingUp,
  Sparkles,
  Target,
  Lightbulb,
  type LucideIcon
} from "lucide-react";
import type { Archetype } from "@/lib/archetypes";
import type { DimensionScore } from "@/types";

export interface ContentRecommendation {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
  badge?: string;
  premium?: boolean;
  relevance: number; // 0-100 score for sorting
}

// MBTI type mappings based on common patterns
const archetypeToMBTI: Record<string, string[]> = {
  innovator: ["ENTP", "ENFP", "INTP"],
  architect: ["INTJ", "INTP", "ENTJ"],
  catalyst: ["ENFP", "ENFJ", "ESFP"],
  strategist: ["ISTJ", "ESTJ", "ENTJ"],
  connector: ["ESFJ", "ENFJ", "ESFP"],
  guardian: ["ISFJ", "ESFJ", "ISTJ"],
  explorer: ["ESTP", "ENFP", "ISTP"],
  stabilizer: ["ISFP", "INFP", "ISFJ"],
  visionary: ["ENTJ", "INTJ", "ENFJ"],
  harmonizer: ["INFP", "INFJ", "ISFP"],
  achiever: ["ESTJ", "ENTJ", "ESTP"],
  analyst: ["INTJ", "INTP", "ISTJ"],
};

// Enneagram type mappings based on common patterns  
const archetypeToEnneagram: Record<string, string[]> = {
  innovator: ["7", "4", "3"],
  architect: ["5", "1", "3"],
  catalyst: ["7", "3", "2"],
  strategist: ["1", "6", "3"],
  connector: ["2", "7", "9"],
  guardian: ["1", "2", "6"],
  explorer: ["7", "8", "3"],
  stabilizer: ["9", "4", "6"],
  visionary: ["3", "8", "1"],
  harmonizer: ["9", "2", "4"],
  achiever: ["3", "8", "1"],
  analyst: ["5", "1", "6"],
};

// Related archetypes for cross-linking
const relatedArchetypes: Record<string, string[]> = {
  innovator: ["architect", "catalyst", "explorer"],
  architect: ["innovator", "analyst", "visionary"],
  catalyst: ["innovator", "connector", "explorer"],
  strategist: ["guardian", "achiever", "analyst"],
  connector: ["catalyst", "guardian", "harmonizer"],
  guardian: ["strategist", "connector", "stabilizer"],
  explorer: ["innovator", "catalyst", "achiever"],
  stabilizer: ["guardian", "harmonizer", "strategist"],
  visionary: ["architect", "innovator", "achiever"],
  harmonizer: ["connector", "guardian", "stabilizer"],
  achiever: ["strategist", "visionary", "explorer"],
  analyst: ["architect", "strategist", "visionary"],
};

export function getPersonalizedContent(
  archetype: Archetype,
  scores: DimensionScore[]
): ContentRecommendation[] {
  const recommendations: ContentRecommendation[] = [];
  
  // Get score map for dimension-based recommendations
  const scoreMap = scores.reduce((acc, s) => ({ ...acc, [s.dimension]: s.percentile }), {} as Record<string, number>);
  
  // 1. Primary type page (always first)
  recommendations.push({
    title: `Complete Guide to ${archetype.name}`,
    description: "Relationships, careers, growth strategies, and more",
    href: `/type/${archetype.id}`,
    icon: BookOpen,
    iconColor: "text-primary",
    iconBg: "bg-primary/10",
    badge: "Your Type",
    relevance: 100,
  });

  // 2. Most related MBTI type
  const mbtiTypes = archetypeToMBTI[archetype.id] || ["INTJ"];
  recommendations.push({
    title: `${mbtiTypes[0]} Personality Type`,
    description: `Explore the MBTI type most similar to ${archetype.name}`,
    href: `/type/mbti/${mbtiTypes[0].toLowerCase()}`,
    icon: Brain,
    iconColor: "text-blue-500",
    iconBg: "bg-blue-500/10",
    badge: "MBTI",
    relevance: 90,
  });

  // 3. Most related Enneagram type
  const enneagramTypes = archetypeToEnneagram[archetype.id] || ["5"];
  recommendations.push({
    title: `Enneagram Type ${enneagramTypes[0]}`,
    description: `The Enneagram type that resonates with your profile`,
    href: `/type/enneagram/${enneagramTypes[0]}`,
    icon: Sparkles,
    iconColor: "text-purple-500",
    iconBg: "bg-purple-500/10",
    badge: "Enneagram",
    relevance: 85,
  });

  // 4. Blog post about methodology
  recommendations.push({
    title: "Why Most Personality Tests Fall Short",
    description: "The science behind accurate personality assessment",
    href: "/blog/why-most-personality-tests-fall-short",
    icon: Lightbulb,
    iconColor: "text-amber-500",
    iconBg: "bg-amber-500/10",
    relevance: 70,
  });

  // 5. Relationship content based on archetype
  recommendations.push({
    title: `${archetype.name} in Relationships`,
    description: "Deep dive into romantic, friendship, and work dynamics",
    href: `/type/${archetype.id}/relationships`,
    icon: Heart,
    iconColor: "text-pink-500",
    iconBg: "bg-pink-500/10",
    relevance: 80,
  });

  // 6. Career content (premium)
  recommendations.push({
    title: `${archetype.name} Career Guide`,
    description: "15+ career matches with salary data and fit scores",
    href: `/type/${archetype.id}/careers`,
    icon: Briefcase,
    iconColor: "text-emerald-500",
    iconBg: "bg-emerald-500/10",
    premium: true,
    relevance: 75,
  });

  // 7. Related archetype exploration
  const related = relatedArchetypes[archetype.id] || ["innovator"];
  recommendations.push({
    title: `Explore The ${related[0].charAt(0).toUpperCase() + related[0].slice(1)}`,
    description: "A type closely related to your personality",
    href: `/type/${related[0]}`,
    icon: Users,
    iconColor: "text-cyan-500",
    iconBg: "bg-cyan-500/10",
    relevance: 65,
  });

  // 8. Growth strategies (premium)
  recommendations.push({
    title: `${archetype.name} Growth Strategies`,
    description: "Personalized 30-day development plan",
    href: `/type/${archetype.id}/growth`,
    icon: TrendingUp,
    iconColor: "text-green-500",
    iconBg: "bg-green-500/10",
    premium: true,
    relevance: 72,
  });

  // 9. Add dimension-specific recommendations
  const topDimension = scores.reduce((max, s) => s.percentile > max.percentile ? s : max, scores[0]);
  const dimensionContent = getDimensionContent(topDimension);
  if (dimensionContent) {
    recommendations.push(dimensionContent);
  }

  // 10. Science page
  recommendations.push({
    title: "Our Scientific Methodology",
    description: "Learn about the HEXACO+ model behind PRISM-7",
    href: "/science",
    icon: Target,
    iconColor: "text-indigo-500",
    iconBg: "bg-indigo-500/10",
    relevance: 50,
  });

  // Sort by relevance and return
  return recommendations.sort((a, b) => b.relevance - a.relevance);
}

function getDimensionContent(dimension: DimensionScore): ContentRecommendation | null {
  const dimensionTopics: Record<string, ContentRecommendation> = {
    openness: {
      title: "Understanding High Openness",
      description: "Why creative thinkers see the world differently",
      href: "/science#openness",
      icon: Sparkles,
      iconColor: "text-violet-500",
      iconBg: "bg-violet-500/10",
      relevance: 60,
    },
    conscientiousness: {
      title: "The Power of Conscientiousness",
      description: "How discipline drives success",
      href: "/science#conscientiousness",
      icon: Target,
      iconColor: "text-emerald-500",
      iconBg: "bg-emerald-500/10",
      relevance: 60,
    },
    extraversion: {
      title: "Extraversion Explained",
      description: "Understanding social energy and engagement",
      href: "/science#extraversion",
      icon: Users,
      iconColor: "text-orange-500",
      iconBg: "bg-orange-500/10",
      relevance: 60,
    },
    agreeableness: {
      title: "The Agreeableness Dimension",
      description: "Cooperation, empathy, and social harmony",
      href: "/science#agreeableness",
      icon: Heart,
      iconColor: "text-pink-500",
      iconBg: "bg-pink-500/10",
      relevance: 60,
    },
    emotionalResilience: {
      title: "Emotional Resilience Insights",
      description: "Building stability under pressure",
      href: "/science#emotional-resilience",
      icon: TrendingUp,
      iconColor: "text-cyan-500",
      iconBg: "bg-cyan-500/10",
      relevance: 60,
    },
    honestyHumility: {
      title: "Honesty-Humility Factor",
      description: "The overlooked dimension in personality",
      href: "/science#honesty-humility",
      icon: Lightbulb,
      iconColor: "text-amber-500",
      iconBg: "bg-amber-500/10",
      relevance: 60,
    },
    adaptability: {
      title: "Adaptability & Change",
      description: "Thriving in uncertain environments",
      href: "/science#adaptability",
      icon: Brain,
      iconColor: "text-blue-500",
      iconBg: "bg-blue-500/10",
      relevance: 60,
    },
  };

  return dimensionTopics[dimension.dimension] || null;
}

// Helper function to get MBTI correlation
export function getMBTICorrelations(archetypeId: string): string[] {
  return archetypeToMBTI[archetypeId] || ["INTJ"];
}

// Helper function to get Enneagram correlation
export function getEnneagramCorrelations(archetypeId: string): string[] {
  return archetypeToEnneagram[archetypeId] || ["5"];
}

// Helper function to get related types
export function getRelatedTypes(archetypeId: string): string[] {
  return relatedArchetypes[archetypeId] || ["innovator", "architect", "catalyst"];
}

