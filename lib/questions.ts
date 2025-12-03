/**
 * Question loading and management utilities
 * Updated to use the new question selection algorithm with coverage guarantees
 */
import { supabase } from "./supabase";
import { mockQuestions } from "./mock-questions";
import {
  selectQuestions,
  selectQuestionsForUser,
  validateSelection,
  getSelectionStats,
  type AssessmentTier,
  type RequestedFramework,
  TIER_CONFIGS,
} from "./question-selection";
import type { Question } from "@/types";

// Re-export types and configs for convenience
export type { AssessmentTier, RequestedFramework };
export { TIER_CONFIGS, getSelectionStats, validateSelection };

/**
 * Load all questions from the database
 */
export async function loadQuestions(): Promise<Question[]> {
  // Check if Supabase is configured
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // If Supabase is not configured, use mock data
  if (!supabaseUrl || !supabaseKey) {
    console.warn("Supabase not configured, using mock questions");
    return mockQuestions;
  }

  try {
    const { data, error } = await supabase
      .from("questions")
      .select("*")
      .order("order_index", { ascending: true });

    if (error) {
      console.error("Error loading questions from Supabase:", error);
      console.warn("Falling back to mock questions");
      return mockQuestions;
    }

    // If no data returned, use mock questions
    if (!data || data.length === 0) {
      console.warn("No questions found in database, using mock questions");
      return mockQuestions;
    }

    return data.map((q) => ({
      id: q.id,
      text: q.text,
      type: q.type as Question["type"],
      dimension: q.dimension as Question["dimension"],
      options: q.options ? (Array.isArray(q.options) ? q.options : []) : undefined,
      reverse_scored: q.reverse_scored || false,
      weight: q.weight || 1.0,
      framework_tags: q.framework_tags || [],
      discrimination: q.discrimination || 1.0,
    }));
  } catch (error) {
    console.error("Exception loading questions:", error);
    console.warn("Falling back to mock questions");
    return mockQuestions;
  }
}

/**
 * Load and select questions for an assessment based on tier and frameworks
 */
export async function loadQuestionsForAssessment(
  tier: AssessmentTier = "standard",
  frameworks: RequestedFramework[] = ["prism"]
): Promise<Question[]> {
  const questionBank = await loadQuestions();
  return selectQuestions(questionBank, tier, frameworks);
}

/**
 * Load and select questions for a specific user, optionally excluding previously seen
 */
export async function loadQuestionsForUser(
  tier: AssessmentTier = "standard",
  frameworks: RequestedFramework[] = ["prism"],
  excludeQuestionIds: string[] = []
): Promise<Question[]> {
  const questionBank = await loadQuestions();
  return selectQuestionsForUser(questionBank, tier, frameworks, excludeQuestionIds);
}

/**
 * Get questions filtered by dimension
 */
export function getQuestionByDimension(
  questions: Question[],
  dimension: Question["dimension"]
): Question[] {
  return questions.filter((q) => q.dimension === dimension);
}

/**
 * Fisher-Yates shuffle
 */
export function shuffleQuestions(questions: Question[]): Question[] {
  const shuffled = [...questions];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Legacy filter function - now uses the selection algorithm internally
 * Kept for backward compatibility
 */
export function filterQuestionsByType(
  questions: Question[],
  assessmentType: "quick" | "standard" | "full"
): Question[] {
  // Map assessment types to tier configs
  switch (assessmentType) {
    case "quick":
      // 35 questions - PRISM-7 only
      return selectQuestions(questions, "quick", ["prism"]);
    case "standard":
      // 80 questions - PRISM-7, MBTI, and Enneagram
      return selectQuestions(questions, "standard", ["prism", "mbti", "enneagram"]);
    case "full":
    default:
      // 105 questions - comprehensive with all frameworks
      return selectQuestions(questions, "comprehensive", ["prism", "mbti", "enneagram"]);
  }
}

/**
 * Get assessment configuration for a tier
 */
export function getAssessmentConfig(tier: AssessmentTier) {
  const config = TIER_CONFIGS[tier];
  return {
    tier,
    totalQuestions: config.totalQuestions,
    estimatedMinutes: Math.ceil(config.totalQuestions * 0.5), // ~30 seconds per question
    minQuestionsPerDimension: config.minPerPrismDimension,
    includesMbti: config.minPerMbtiDimension > 0,
    includesEnneagram: config.minPerEnneagramType > 0,
    description: getTierDescription(tier),
  };
}

function getTierDescription(tier: AssessmentTier): string {
  switch (tier) {
    case "quick":
      return "A brief assessment providing core PRISM-7 dimensional scores. Ideal for time-constrained situations.";
    case "standard":
      return "A balanced assessment with PRISM-7 scores and MBTI type mapping. Recommended for most users.";
    case "comprehensive":
      return "The most detailed assessment including PRISM-7, MBTI, and Enneagram mappings. Best for deep self-understanding.";
  }
}

/**
 * Get all available tiers and their configurations
 */
export function getAvailableTiers() {
  return Object.keys(TIER_CONFIGS).map((tier) =>
    getAssessmentConfig(tier as AssessmentTier)
  );
}
