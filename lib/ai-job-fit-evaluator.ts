/**
 * AI-Powered Job Fit Evaluator
 * 
 * Uses high-end reasoning models (Gemini 3 Pro, Kimi K2) via OpenRouter
 * to provide robust, scientifically-grounded candidate-job fit evaluations.
 * 
 * Features:
 * - Deep chain-of-thought reasoning for nuanced analysis
 * - Confidence-weighted scoring accounting for measurement uncertainty
 * - Red flag detection for hiring risks
 * - EEOC-compliant evaluation (focuses on job-relevant traits only)
 * - Team dynamics impact analysis
 */

import { 
  generateStructuredContent, 
  MODEL_RECOMMENDATIONS,
  type OpenRouterMessage 
} from "./openrouter";
import type { DimensionScore, Dimension } from "@/types";
import type { JobProfile, JobFitResult, DimensionFit } from "./job-fit-scoring";

// ============================================================================
// Types
// ============================================================================

export interface CandidateProfile {
  id: string;
  name?: string;
  scores: DimensionScore[];
  validityScore?: number; // 0-100, how consistent/honest their responses were
  assessmentDate?: string;
}

export interface AIFitEvaluation {
  // Core scoring
  overallFitScore: number; // 0-100
  confidenceLevel: "high" | "medium" | "low";
  confidenceReason: string;
  
  // Detailed breakdown
  dimensionAnalysis: DimensionAnalysis[];
  
  // Risk assessment
  redFlags: RedFlag[];
  greenFlags: string[]; // Strong positives
  
  // Recommendations
  hiringRecommendation: "strong_yes" | "yes" | "maybe" | "no" | "strong_no";
  interviewFocusAreas: string[];
  onboardingConsiderations: string[];
  
  // Team impact (if team data provided)
  teamImpact?: TeamImpactAnalysis;
  
  // AI reasoning transparency
  reasoning: string; // Full chain-of-thought explanation
  modelUsed: string;
}

export interface DimensionAnalysis {
  dimension: Dimension;
  label: string;
  candidatePercentile: number;
  targetPercentile: number;
  weight: number;
  fitScore: number; // 0-100
  analysis: string; // AI explanation of this dimension's fit
  concernLevel: "none" | "minor" | "moderate" | "significant";
}

export interface RedFlag {
  severity: "warning" | "concern" | "critical";
  dimension?: Dimension;
  issue: string;
  mitigation?: string; // How to address in interview/onboarding
}

export interface TeamImpactAnalysis {
  overallImpact: "positive" | "neutral" | "mixed" | "negative";
  strengthsAdded: string[];
  potentialConflicts: string[];
  gapsFilled: string[];
  recommendation: string;
}

export interface TeamMember {
  id: string;
  name?: string;
  role?: string;
  scores: DimensionScore[];
}

export interface EvaluationOptions {
  includeTeamAnalysis?: boolean;
  teamMembers?: TeamMember[];
  jobContext?: string; // Additional context about the role
  companyValues?: string[]; // Company culture values to consider
  mustHaveTraits?: Dimension[]; // Non-negotiable trait requirements
  preferredModel?: "gemini-3-pro" | "kimi-k2";
}

// ============================================================================
// Dimension Labels & Descriptions
// ============================================================================

const DIMENSION_INFO: Record<Dimension, { label: string; description: string; jobRelevance: string }> = {
  openness: {
    label: "Openness",
    description: "Creativity, curiosity, intellectual flexibility, openness to new experiences",
    jobRelevance: "Innovation roles, creative work, R&D, strategy, roles requiring learning agility"
  },
  conscientiousness: {
    label: "Conscientiousness", 
    description: "Organization, reliability, attention to detail, self-discipline, goal-orientation",
    jobRelevance: "Operations, finance, project management, any role requiring dependability"
  },
  extraversion: {
    label: "Extraversion",
    description: "Social energy, assertiveness, enthusiasm, comfort with people and attention",
    jobRelevance: "Sales, leadership, client-facing roles, team collaboration, public speaking"
  },
  agreeableness: {
    label: "Agreeableness",
    description: "Cooperation, empathy, trust, conflict avoidance, team harmony",
    jobRelevance: "Customer service, HR, healthcare, teaching, team-based environments"
  },
  emotionalResilience: {
    label: "Emotional Resilience",
    description: "Stress tolerance, calm under pressure, emotional stability, composure",
    jobRelevance: "High-pressure roles, crisis management, leadership, healthcare, finance"
  },
  honestyHumility: {
    label: "Honesty-Humility",
    description: "Authenticity, ethical behavior, modesty, fairness, sincerity",
    jobRelevance: "Fiduciary roles, leadership, positions of trust, compliance, ethics"
  },
  adaptability: {
    label: "Adaptability",
    description: "Flexibility, comfort with change, pivoting ability, resilience to uncertainty",
    jobRelevance: "Startups, fast-paced environments, consulting, roles with frequent change"
  }
};

// ============================================================================
// Prompt Templates
// ============================================================================

const EVALUATION_SYSTEM_PROMPT = `You are an expert Industrial-Organizational Psychologist with 20+ years of experience in personnel selection and assessment. You specialize in using the HEXACO+ personality model (which PRISM-7 is based on) to predict job performance.

Your evaluations are:
- SCIENTIFICALLY GROUNDED: Based on validated personality-performance research
- LEGALLY COMPLIANT: Focus only on job-relevant traits, never protected characteristics
- NUANCED: Recognize that personality is dimensional, not categorical
- ACTIONABLE: Provide specific, useful recommendations

CRITICAL RULES:
1. Never make assumptions based on protected characteristics (race, gender, age, religion, etc.)
2. Focus exclusively on job-relevant personality traits
3. Acknowledge measurement uncertainty - no personality test is perfect
4. Recognize that low fit doesn't mean "bad person" - just potential mismatch for THIS role
5. Provide constructive framing - how to leverage strengths, address gaps`;

function buildEvaluationPrompt(
  candidate: CandidateProfile,
  jobProfile: JobProfile,
  options: EvaluationOptions
): string {
  const candidateScoresText = candidate.scores
    .map(s => {
      const info = DIMENSION_INFO[s.dimension];
      const ci = s.confidence_interval;
      return `- ${info.label}: ${s.percentile}th percentile (CI: ${ci[0].toFixed(0)}-${ci[1].toFixed(0)})`;
    })
    .join("\n");

  const jobRequirementsText = Object.entries(DIMENSION_INFO)
    .map(([dim, info]) => {
      const targetKey = `target_${dim.replace(/([A-Z])/g, '_$1').toLowerCase()}` as keyof JobProfile;
      const weightKey = `weight_${dim.replace(/([A-Z])/g, '_$1').toLowerCase()}` as keyof JobProfile;
      const target = (jobProfile[targetKey] as number) ?? 50;
      const weight = (jobProfile[weightKey] as number) ?? 1.0;
      const importance = weight >= 1.3 ? "CRITICAL" : weight >= 1.1 ? "Important" : "Standard";
      return `- ${info.label}: Target ${target}th percentile (${importance}, weight: ${weight})`;
    })
    .join("\n");

  let teamSection = "";
  if (options.includeTeamAnalysis && options.teamMembers?.length) {
    const teamAvgs = calculateTeamAverages(options.teamMembers);
    teamSection = `
CURRENT TEAM COMPOSITION (${options.teamMembers.length} members):
Team averages:
${Object.entries(teamAvgs).map(([dim, avg]) => `- ${DIMENSION_INFO[dim as Dimension].label}: ${avg.toFixed(0)}th percentile`).join("\n")}

Consider how this candidate would affect team dynamics, fill gaps, or create redundancy.
`;
  }

  let mustHaveSection = "";
  if (options.mustHaveTraits?.length) {
    mustHaveSection = `
NON-NEGOTIABLE REQUIREMENTS:
The following traits are absolute must-haves for this role:
${options.mustHaveTraits.map(d => `- ${DIMENSION_INFO[d].label}`).join("\n")}
Candidates significantly below target on these should receive a "no" recommendation.
`;
  }

  return `CANDIDATE ASSESSMENT REQUEST

CANDIDATE PROFILE:
${candidate.name ? `Name: ${candidate.name}` : `ID: ${candidate.id}`}
${candidate.validityScore !== undefined ? `Validity Score: ${candidate.validityScore}/100 (${candidate.validityScore >= 80 ? "High - responses appear consistent and honest" : candidate.validityScore >= 60 ? "Moderate - some inconsistency detected" : "Low - responses may be unreliable"})` : ""}
Assessment Date: ${candidate.assessmentDate || "Recent"}

PERSONALITY SCORES (PRISM-7 Dimensions):
${candidateScoresText}

JOB REQUIREMENTS:
${jobRequirementsText}
${options.jobContext ? `\nAdditional Context: ${options.jobContext}` : ""}
${options.companyValues?.length ? `\nCompany Values: ${options.companyValues.join(", ")}` : ""}
${mustHaveSection}
${teamSection}

TASK:
Provide a comprehensive job fit evaluation. Think step-by-step:

1. DIMENSION-BY-DIMENSION ANALYSIS
   For each dimension, analyze:
   - How close is the candidate to the target?
   - Given the confidence interval, what's the range of likely true scores?
   - How important is this dimension for the role (based on weight)?
   - What are the practical implications of any gaps?

2. OVERALL FIT ASSESSMENT
   - Calculate a holistic fit score considering weighted dimensions
   - Identify standout strengths (green flags)
   - Identify potential concerns (red flags with severity)
   - Assess confidence in the evaluation

3. HIRING RECOMMENDATION
   - strong_yes: Exceptional fit, proceed confidently
   - yes: Good fit, recommend hiring
   - maybe: Mixed signals, needs interview exploration
   - no: Significant concerns for this role
   - strong_no: Clear mismatch, do not proceed

4. ACTIONABLE GUIDANCE
   - What to explore in interviews
   - Onboarding considerations if hired
   ${options.includeTeamAnalysis ? "- Impact on team dynamics" : ""}

Respond with ONLY valid JSON matching this structure:
{
  "overallFitScore": 75,
  "confidenceLevel": "high" | "medium" | "low",
  "confidenceReason": "Why this confidence level",
  "dimensionAnalysis": [
    {
      "dimension": "openness",
      "label": "Openness",
      "candidatePercentile": 72,
      "targetPercentile": 70,
      "weight": 1.2,
      "fitScore": 95,
      "analysis": "Detailed analysis of this dimension...",
      "concernLevel": "none" | "minor" | "moderate" | "significant"
    }
  ],
  "redFlags": [
    {
      "severity": "warning" | "concern" | "critical",
      "dimension": "conscientiousness",
      "issue": "Description of the concern",
      "mitigation": "How to address this"
    }
  ],
  "greenFlags": ["Strong positive 1", "Strong positive 2"],
  "hiringRecommendation": "yes",
  "interviewFocusAreas": ["Area 1 to explore", "Area 2 to explore"],
  "onboardingConsiderations": ["Consideration 1", "Consideration 2"],
  ${options.includeTeamAnalysis ? `"teamImpact": {
    "overallImpact": "positive" | "neutral" | "mixed" | "negative",
    "strengthsAdded": ["Strength 1"],
    "potentialConflicts": ["Conflict 1"],
    "gapsFilled": ["Gap 1"],
    "recommendation": "Team fit recommendation"
  },` : ""}
  "reasoning": "Full chain-of-thought explanation of your analysis process and conclusions"
}`;
}

// ============================================================================
// Helper Functions
// ============================================================================

function calculateTeamAverages(team: TeamMember[]): Record<Dimension, number> {
  const dimensions: Dimension[] = [
    "openness", "conscientiousness", "extraversion", "agreeableness",
    "emotionalResilience", "honestyHumility", "adaptability"
  ];
  
  const averages: Record<string, number> = {};
  
  for (const dim of dimensions) {
    const scores = team
      .map(m => m.scores.find(s => s.dimension === dim)?.percentile)
      .filter((s): s is number => s !== undefined);
    
    averages[dim] = scores.length > 0 
      ? scores.reduce((a, b) => a + b, 0) / scores.length 
      : 50;
  }
  
  return averages as Record<Dimension, number>;
}

// ============================================================================
// Main Evaluation Function
// ============================================================================

/**
 * Perform AI-powered job fit evaluation using high-end reasoning models
 * 
 * @param candidate - Candidate's personality profile
 * @param jobProfile - Job requirements profile
 * @param options - Additional evaluation options
 * @returns Comprehensive fit evaluation with recommendations
 */
export async function evaluateCandidateFit(
  candidate: CandidateProfile,
  jobProfile: JobProfile,
  options: EvaluationOptions = {}
): Promise<AIFitEvaluation> {
  const model = options.preferredModel === "kimi-k2" 
    ? MODEL_RECOMMENDATIONS.jobFitEvaluationFallback
    : MODEL_RECOMMENDATIONS.jobFitEvaluation;

  const messages: OpenRouterMessage[] = [
    { role: "system", content: EVALUATION_SYSTEM_PROMPT },
    { role: "user", content: buildEvaluationPrompt(candidate, jobProfile, options) }
  ];

  try {
    const result = await generateStructuredContent<AIFitEvaluation>(messages, {
      model,
      temperature: 0.2, // Low temperature for consistent, analytical output
      maxTokens: 4000,
    });

    return {
      ...result,
      modelUsed: model,
    };
  } catch (error) {
    // If primary model fails, try fallback
    if (model === MODEL_RECOMMENDATIONS.jobFitEvaluation) {
      console.warn("Primary model failed, trying fallback:", error);
      return evaluateCandidateFit(candidate, jobProfile, {
        ...options,
        preferredModel: "kimi-k2"
      });
    }
    throw error;
  }
}

/**
 * Batch evaluate multiple candidates for ranking
 */
export async function evaluateAndRankCandidates(
  candidates: CandidateProfile[],
  jobProfile: JobProfile,
  options: EvaluationOptions = {}
): Promise<Array<{ candidate: CandidateProfile; evaluation: AIFitEvaluation; rank: number }>> {
  // Evaluate all candidates in parallel (with concurrency limit)
  const CONCURRENCY_LIMIT = 3;
  const results: Array<{ candidate: CandidateProfile; evaluation: AIFitEvaluation }> = [];
  
  for (let i = 0; i < candidates.length; i += CONCURRENCY_LIMIT) {
    const batch = candidates.slice(i, i + CONCURRENCY_LIMIT);
    const batchResults = await Promise.all(
      batch.map(async (candidate) => ({
        candidate,
        evaluation: await evaluateCandidateFit(candidate, jobProfile, options)
      }))
    );
    results.push(...batchResults);
  }

  // Sort by overall fit score (descending)
  results.sort((a, b) => b.evaluation.overallFitScore - a.evaluation.overallFitScore);

  // Add rank
  return results.map((r, index) => ({
    ...r,
    rank: index + 1
  }));
}

// ============================================================================
// Quick Scoring (Non-AI fallback for faster results)
// ============================================================================

/**
 * Fast mathematical scoring without AI (for quick estimates)
 * Use evaluateCandidateFit for comprehensive AI-powered evaluation
 */
export function quickFitScore(
  candidate: CandidateProfile,
  jobProfile: JobProfile
): { score: number; breakdown: Record<Dimension, number> } {
  const dimensions: Dimension[] = [
    "openness", "conscientiousness", "extraversion", "agreeableness",
    "emotionalResilience", "honestyHumility", "adaptability"
  ];

  let weightedSum = 0;
  let totalWeight = 0;
  const breakdown: Record<string, number> = {};

  for (const dim of dimensions) {
    const candidateScore = candidate.scores.find(s => s.dimension === dim)?.percentile ?? 50;
    const targetKey = `target_${dim.replace(/([A-Z])/g, '_$1').toLowerCase()}` as keyof JobProfile;
    const weightKey = `weight_${dim.replace(/([A-Z])/g, '_$1').toLowerCase()}` as keyof JobProfile;
    
    const target = (jobProfile[targetKey] as number) ?? 50;
    const weight = (jobProfile[weightKey] as number) ?? 1.0;

    // Gaussian fit calculation
    const difference = Math.abs(candidateScore - target);
    const sigma = 20;
    const fit = 100 * Math.exp(-(difference ** 2) / (2 * sigma ** 2));

    breakdown[dim] = Math.round(fit);
    weightedSum += fit * weight;
    totalWeight += weight;
  }

  return {
    score: Math.round(weightedSum / totalWeight),
    breakdown: breakdown as Record<Dimension, number>
  };
}

// ============================================================================
// Exports
// ============================================================================

export { DIMENSION_INFO };


