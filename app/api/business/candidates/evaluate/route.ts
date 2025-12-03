/**
 * AI-Powered Candidate Evaluation API
 * 
 * Uses high-end reasoning models (Gemini 3 Pro, Kimi K2) via OpenRouter
 * to provide comprehensive job fit evaluations.
 * 
 * Features aligned with prism7test.com/for-employers:
 * - Predictive Fit Scoring (0-100)
 * - Red flag detection
 * - Interview focus recommendations
 * - Team composition analysis (optional)
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { 
  evaluateCandidateFit, 
  evaluateAndRankCandidates,
  quickFitScore,
  type CandidateProfile,
  type TeamMember,
  type EvaluationOptions 
} from "@/lib/ai-job-fit-evaluator";
import type { JobProfile } from "@/lib/job-fit-scoring";
import type { DimensionScore } from "@/types";

interface EvaluateRequest {
  // Single candidate evaluation
  candidate?: CandidateProfile;
  
  // Batch evaluation for ranking
  candidates?: CandidateProfile[];
  
  // Job requirements
  jobProfile: JobProfile;
  
  // Options
  options?: {
    includeTeamAnalysis?: boolean;
    teamMembers?: TeamMember[];
    jobContext?: string;
    companyValues?: string[];
    mustHaveTraits?: string[];
    preferredModel?: "gemini-3-pro" | "kimi-k2";
    quickMode?: boolean; // Skip AI, use mathematical scoring only
  };
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body: EvaluateRequest = await request.json();
    const { candidate, candidates, jobProfile, options = {} } = body;

    // Validate input
    if (!candidate && !candidates?.length) {
      return NextResponse.json(
        { error: "Either 'candidate' or 'candidates' array is required" },
        { status: 400 }
      );
    }

    if (!jobProfile) {
      return NextResponse.json(
        { error: "jobProfile is required" },
        { status: 400 }
      );
    }

    // Quick mode - mathematical scoring only (no AI)
    if (options.quickMode) {
      if (candidate) {
        const quickResult = quickFitScore(candidate, jobProfile);
        return NextResponse.json({
          success: true,
          mode: "quick",
          result: {
            candidateId: candidate.id,
            overallFitScore: quickResult.score,
            dimensionBreakdown: quickResult.breakdown,
          }
        });
      } else if (candidates) {
        const results = candidates.map(c => ({
          candidateId: c.id,
          ...quickFitScore(c, jobProfile)
        }));
        results.sort((a, b) => b.score - a.score);
        return NextResponse.json({
          success: true,
          mode: "quick",
          results: results.map((r, i) => ({ ...r, rank: i + 1 }))
        });
      }
    }

    // Full AI-powered evaluation
    const evaluationOptions: EvaluationOptions = {
      includeTeamAnalysis: options.includeTeamAnalysis,
      teamMembers: options.teamMembers,
      jobContext: options.jobContext,
      companyValues: options.companyValues,
      mustHaveTraits: options.mustHaveTraits as any,
      preferredModel: options.preferredModel,
    };

    // Single candidate
    if (candidate) {
      const evaluation = await evaluateCandidateFit(
        candidate,
        jobProfile,
        evaluationOptions
      );

      return NextResponse.json({
        success: true,
        mode: "ai",
        result: {
          candidateId: candidate.id,
          candidateName: candidate.name,
          evaluation,
        }
      });
    }

    // Multiple candidates - batch evaluate and rank
    if (candidates) {
      const rankedResults = await evaluateAndRankCandidates(
        candidates,
        jobProfile,
        evaluationOptions
      );

      return NextResponse.json({
        success: true,
        mode: "ai",
        results: rankedResults.map(r => ({
          candidateId: r.candidate.id,
          candidateName: r.candidate.name,
          rank: r.rank,
          evaluation: r.evaluation,
        })),
        summary: {
          totalCandidates: candidates.length,
          strongYes: rankedResults.filter(r => r.evaluation.hiringRecommendation === "strong_yes").length,
          yes: rankedResults.filter(r => r.evaluation.hiringRecommendation === "yes").length,
          maybe: rankedResults.filter(r => r.evaluation.hiringRecommendation === "maybe").length,
          no: rankedResults.filter(r => ["no", "strong_no"].includes(r.evaluation.hiringRecommendation)).length,
        }
      });
    }

    return NextResponse.json(
      { error: "Invalid request" },
      { status: 400 }
    );

  } catch (error) {
    console.error("Candidate evaluation error:", error);
    return NextResponse.json(
      { 
        error: "Failed to evaluate candidate(s)",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

/**
 * GET endpoint to check evaluation status/health
 */
export async function GET() {
  return NextResponse.json({
    service: "AI Candidate Evaluation",
    status: "healthy",
    features: [
      "Predictive Fit Scoring (0-100)",
      "Red Flag Detection",
      "Interview Focus Recommendations", 
      "Team Composition Analysis",
      "Candidate Ranking",
      "EEOC Compliant Evaluation"
    ],
    models: {
      primary: "google/gemini-3-pro-preview",
      fallback: "moonshotai/kimi-k2"
    },
    pricing: {
      note: "AI evaluation costs apply per candidate"
    }
  });
}

