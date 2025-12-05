/**
 * Progressive Assessment Stages
 * 
 * The assessment is a successive journey through 3 stages:
 * 1. PRISM (Free, No Auth) - Get your core personality dimensions
 * 2. Extended (Free with Auth) - Add MBTI + Enneagram insights  
 * 3. Deep Dive (Paid) - Dark Triad, facets, career guidance
 * 
 * Each stage has its own progress tracking and delivers a "dopamine hit"
 * with meaningful results at the end.
 */

export interface AssessmentStage {
  id: "prism" | "extended" | "deep-dive";
  name: string;
  displayName: string;
  description: string;
  questionCount: number;
  cumulativeQuestions: number;  // Total questions up to and including this stage
  timeEstimate: string;
  unlocks: string[];
  requiresAuth: boolean;
  requiresPayment: boolean;
  gate: "none" | "auth" | "payment";  // What gate comes AFTER completing this stage
  nextStage: AssessmentStage["id"] | null;
}

export const ASSESSMENT_STAGES: AssessmentStage[] = [
  {
    id: "prism",
    name: "PRISM-7 Profile",
    displayName: "Discover Your Core",
    description: "Uncover your authentic personality across 7 scientific dimensions",
    questionCount: 35,
    cumulativeQuestions: 35,
    timeEstimate: "~8 minutes",
    unlocks: [
      "PRISM-7 dimensional scores",
      "Your personality archetype",
      "Radar chart visualization",
      "Basic strengths & insights"
    ],
    requiresAuth: false,
    requiresPayment: false,
    gate: "auth",  // Auth gate after PRISM results
    nextStage: "extended",
  },
  {
    id: "extended",
    name: "MBTI & Enneagram",
    displayName: "Go Deeper",
    description: "Discover your MBTI type and Enneagram number",
    questionCount: 45,  // 80 - 35 = 45 additional questions
    cumulativeQuestions: 80,
    timeEstimate: "~11 minutes",
    unlocks: [
      "Your MBTI type (e.g., ENFP)",
      "Enneagram type & wing",
      "Cognitive function stack",
      "Type-specific insights",
      "Compatibility basics"
    ],
    requiresAuth: true,
    requiresPayment: false,
    gate: "none",  // No payment gate here - continue to Deep Dive
    nextStage: "deep-dive",
  },
  {
    id: "deep-dive",
    name: "Deep Dive",
    displayName: "The Complete Picture",
    description: "Complete your comprehensive personality analysis",
    questionCount: 25,  // 105 - 80 = 25 additional questions
    cumulativeQuestions: 105,
    timeEstimate: "~6 minutes",
    unlocks: [
      "Dark Triad profile",
      "Facet-level analysis",
      "15+ career matches with fit scores",
      "Full compatibility report",
      "Personalized growth plan",
      "Downloadable PDF report"
    ],
    requiresAuth: true,
    requiresPayment: false,  // Paywall is on results page, not stage
    gate: "none",  // Go straight to results (paywall is there)
    nextStage: null,
  },
];

// Get stage by ID
export function getStageById(id: AssessmentStage["id"]): AssessmentStage {
  const stage = ASSESSMENT_STAGES.find(s => s.id === id);
  if (!stage) throw new Error(`Unknown stage: ${id}`);
  return stage;
}

// Get current stage based on questions answered
export function getCurrentStage(questionsAnswered: number): AssessmentStage {
  for (const stage of ASSESSMENT_STAGES) {
    if (questionsAnswered < stage.cumulativeQuestions) {
      return stage;
    }
  }
  return ASSESSMENT_STAGES[ASSESSMENT_STAGES.length - 1];
}

// Get the stage that was just completed (if any)
export function getCompletedStage(questionsAnswered: number): AssessmentStage | null {
  for (const stage of ASSESSMENT_STAGES) {
    if (questionsAnswered === stage.cumulativeQuestions) {
      return stage;
    }
  }
  return null;
}

// Check if a stage boundary was reached
export function isStageComplete(questionsAnswered: number): boolean {
  return ASSESSMENT_STAGES.some(s => s.cumulativeQuestions === questionsAnswered);
}

// Get progress within current stage
export function getStageProgress(questionsAnswered: number): {
  stage: AssessmentStage;
  questionsInStage: number;
  progressPercent: number;
  questionsRemaining: number;
} {
  const stage = getCurrentStage(questionsAnswered);
  const previousCumulative = ASSESSMENT_STAGES.find(s => s.nextStage === stage.id)?.cumulativeQuestions || 0;
  const questionsInStage = questionsAnswered - previousCumulative;
  
  return {
    stage,
    questionsInStage,
    progressPercent: (questionsInStage / stage.questionCount) * 100,
    questionsRemaining: stage.questionCount - questionsInStage,
  };
}

// Get next stage after completing current one
export function getNextStage(currentStageId: AssessmentStage["id"]): AssessmentStage | null {
  const current = getStageById(currentStageId);
  if (!current.nextStage) return null;
  return getStageById(current.nextStage);
}

// Check if user can proceed to next stage (based on gates)
export function canProceedToNextStage(
  completedStageId: AssessmentStage["id"],
  isAuthenticated: boolean,
  hasPurchased: boolean
): { canProceed: boolean; reason: "none" | "auth" | "payment" } {
  const stage = getStageById(completedStageId);
  
  if (stage.gate === "auth" && !isAuthenticated) {
    return { canProceed: false, reason: "auth" };
  }
  
  if (stage.gate === "payment" && !hasPurchased) {
    return { canProceed: false, reason: "payment" };
  }
  
  return { canProceed: true, reason: "none" };
}

// Get all unlocks up to a certain stage
export function getAllUnlocksUpToStage(stageId: AssessmentStage["id"]): string[] {
  const unlocks: string[] = [];
  for (const stage of ASSESSMENT_STAGES) {
    unlocks.push(...stage.unlocks);
    if (stage.id === stageId) break;
  }
  return unlocks;
}

// Get what will be unlocked in next stage (for upsell)
export function getNextStageUnlocks(currentStageId: AssessmentStage["id"]): string[] {
  const next = getNextStage(currentStageId);
  return next ? next.unlocks : [];
}

