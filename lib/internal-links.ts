/**
 * Internal Linking Helper
 * Generates relevant cross-links between personality type pages for SEO
 */

import { ContentTopic } from "./content/types";

// Topic metadata for display
export const TOPIC_METADATA: Record<ContentTopic, { name: string; icon: string; description: string }> = {
  learning: { name: "Learning Style", icon: "📚", description: "How this type learns best" },
  careers: { name: "Career Guide", icon: "💼", description: "Best career paths and workplace advice" },
  relationships: { name: "Relationships", icon: "💕", description: "Love, dating, and connection" },
  communication: { name: "Communication", icon: "💬", description: "How to communicate effectively" },
  stress: { name: "Stress & Coping", icon: "🧘", description: "Managing stress and building resilience" },
  leadership: { name: "Leadership", icon: "👑", description: "Leadership style and management" },
  growth: { name: "Personal Growth", icon: "🌱", description: "Development and self-improvement" },
  workplace: { name: "At Work", icon: "🏢", description: "Workplace dynamics and team roles" },
  compatibility: { name: "Compatibility", icon: "🤝", description: "Type compatibility and pairings" },
};

// Related MBTI types based on shared cognitive functions
export const MBTI_RELATED_TYPES: Record<string, string[]> = {
  intj: ["intp", "entj", "infj"], // Ni users + Te users
  intp: ["intj", "entp", "infp"], // Ti users + Ne users
  entj: ["intj", "estj", "enfj"], // Te users + Ni users
  entp: ["intp", "enfp", "estp"], // Ne users + Ti users
  infj: ["intj", "infp", "enfj"], // Ni users + Fe users
  infp: ["intp", "infj", "enfp"], // Fi users + Ne users
  enfj: ["infj", "entj", "esfj"], // Fe users + Ni users
  enfp: ["infp", "entp", "esfp"], // Ne users + Fi users
  istj: ["estj", "isfj", "intj"], // Si users + Te users
  isfj: ["istj", "esfj", "infj"], // Si users + Fe users
  estj: ["istj", "entj", "esfj"], // Te users + Si users
  esfj: ["isfj", "estj", "enfj"], // Fe users + Si users
  istp: ["estp", "intp", "isfp"], // Ti users + Se users
  isfp: ["esfp", "infp", "istp"], // Fi users + Se users
  estp: ["istp", "entp", "esfp"], // Se users + Ti users
  esfp: ["isfp", "enfp", "estp"], // Se users + Fi users
};

// Related Enneagram types based on wings and lines
export const ENNEAGRAM_RELATED_TYPES: Record<string, string[]> = {
  "1": ["9", "2", "7", "4"], // Wings + growth/stress lines
  "2": ["1", "3", "4", "8"],
  "3": ["2", "4", "6", "9"],
  "4": ["3", "5", "1", "2"],
  "5": ["4", "6", "7", "8"],
  "6": ["5", "7", "3", "9"],
  "7": ["6", "8", "1", "5"],
  "8": ["7", "9", "2", "5"],
  "9": ["8", "1", "3", "6"],
};

// PRISM types that correlate with MBTI types
export const MBTI_TO_PRISM: Record<string, string[]> = {
  intj: ["architect", "visionary", "analyst"],
  intp: ["analyst", "innovator", "architect"],
  entj: ["strategist", "achiever", "visionary"],
  entp: ["innovator", "catalyst", "explorer"],
  infj: ["harmonizer", "visionary", "guardian"],
  infp: ["harmonizer", "innovator", "explorer"],
  enfj: ["catalyst", "connector", "guardian"],
  enfp: ["catalyst", "innovator", "explorer"],
  istj: ["strategist", "guardian", "analyst"],
  isfj: ["guardian", "stabilizer", "connector"],
  estj: ["strategist", "achiever", "guardian"],
  esfj: ["connector", "guardian", "achiever"],
  istp: ["analyst", "explorer", "stabilizer"],
  isfp: ["harmonizer", "explorer", "stabilizer"],
  estp: ["explorer", "achiever", "catalyst"],
  esfp: ["explorer", "connector", "catalyst"],
};

// PRISM types that correlate with Enneagram types
export const ENNEAGRAM_TO_PRISM: Record<string, string[]> = {
  "1": ["guardian", "strategist", "analyst"],
  "2": ["connector", "guardian", "harmonizer"],
  "3": ["achiever", "catalyst", "strategist"],
  "4": ["harmonizer", "innovator", "explorer"],
  "5": ["analyst", "architect", "innovator"],
  "6": ["guardian", "stabilizer", "strategist"],
  "7": ["explorer", "catalyst", "innovator"],
  "8": ["achiever", "strategist", "catalyst"],
  "9": ["stabilizer", "harmonizer", "connector"],
};

export interface InternalLink {
  url: string;
  title: string;
  description?: string;
}

/**
 * Get topic page links for a given type
 */
export function getTopicLinksForType(
  framework: "prism" | "mbti" | "enneagram",
  typeId: string,
  currentTopic?: ContentTopic
): InternalLink[] {
  const baseUrl = framework === "prism" 
    ? `/type/${typeId}`
    : framework === "mbti"
    ? `/type/mbti/${typeId}`
    : `/type/enneagram/${typeId}`;

  return Object.entries(TOPIC_METADATA)
    .filter(([topic]) => topic !== currentTopic)
    .map(([topic, meta]) => ({
      url: `${baseUrl}/${topic}`,
      title: meta.name,
      description: meta.description,
    }));
}

/**
 * Get related type links for MBTI
 */
export function getRelatedMBTITypes(typeId: string): InternalLink[] {
  const related = MBTI_RELATED_TYPES[typeId.toLowerCase()] || [];
  return related.map((type) => ({
    url: `/type/mbti/${type}`,
    title: type.toUpperCase(),
    description: `Explore the ${type.toUpperCase()} personality type`,
  }));
}

/**
 * Get related type links for Enneagram
 */
export function getRelatedEnneagramTypes(typeNum: string): InternalLink[] {
  const related = ENNEAGRAM_RELATED_TYPES[typeNum] || [];
  return related.map((type) => ({
    url: `/type/enneagram/${type}`,
    title: `Type ${type}`,
    description: `Explore Enneagram Type ${type}`,
  }));
}

/**
 * Get PRISM correlation links for MBTI type
 */
export function getPRISMLinksForMBTI(mbtiType: string): InternalLink[] {
  const prismTypes = MBTI_TO_PRISM[mbtiType.toLowerCase()] || [];
  return prismTypes.map((type) => ({
    url: `/type/${type}`,
    title: type.charAt(0).toUpperCase() + type.slice(1),
    description: `See how ${mbtiType.toUpperCase()} maps to PRISM-7's ${type} archetype`,
  }));
}

/**
 * Get PRISM correlation links for Enneagram type
 */
export function getPRISMLinksForEnneagram(typeNum: string): InternalLink[] {
  const prismTypes = ENNEAGRAM_TO_PRISM[typeNum] || [];
  return prismTypes.map((type) => ({
    url: `/type/${type}`,
    title: type.charAt(0).toUpperCase() + type.slice(1),
    description: `See how Type ${typeNum} maps to PRISM-7's ${type} archetype`,
  }));
}

/**
 * Get cross-framework links for comprehensive internal linking
 */
export function getCrossFrameworkLinks(
  framework: "prism" | "mbti" | "enneagram",
  typeId: string
): { mbti: InternalLink[]; enneagram: InternalLink[]; prism: InternalLink[] } {
  const result = {
    mbti: [] as InternalLink[],
    enneagram: [] as InternalLink[],
    prism: [] as InternalLink[],
  };

  if (framework === "mbti") {
    result.prism = getPRISMLinksForMBTI(typeId);
    result.mbti = getRelatedMBTITypes(typeId);
  } else if (framework === "enneagram") {
    result.prism = getPRISMLinksForEnneagram(typeId);
    result.enneagram = getRelatedEnneagramTypes(typeId);
  }

  return result;
}

/**
 * Generate breadcrumb data for type pages
 */
export function getBreadcrumbs(
  framework: "prism" | "mbti" | "enneagram",
  typeId: string,
  typeName: string,
  topic?: ContentTopic
): { name: string; url: string }[] {
  const breadcrumbs = [{ name: "Home", url: "/" }];

  if (framework === "prism") {
    breadcrumbs.push({ name: "PRISM-7 Types", url: "/type/innovator" }); // Link to first type as hub
    breadcrumbs.push({ name: typeName, url: `/type/${typeId}` });
  } else if (framework === "mbti") {
    breadcrumbs.push({ name: "MBTI Types", url: "/type/mbti/intj" });
    breadcrumbs.push({ name: typeId.toUpperCase(), url: `/type/mbti/${typeId}` });
  } else {
    breadcrumbs.push({ name: "Enneagram", url: "/type/enneagram/1" });
    breadcrumbs.push({ name: `Type ${typeId}`, url: `/type/enneagram/${typeId}` });
  }

  if (topic) {
    const topicMeta = TOPIC_METADATA[topic];
    breadcrumbs.push({ name: topicMeta.name, url: breadcrumbs[breadcrumbs.length - 1].url + `/${topic}` });
  }

  return breadcrumbs;
}

