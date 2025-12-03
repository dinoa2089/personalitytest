import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { calculateJobFit, normalizeJobProfile } from "@/lib/job-fit-scoring";
import type { DimensionScore } from "@/types";

const SCORING_API_URL =
  process.env.NEXT_PUBLIC_SCORING_API_URL || "http://localhost:8000";

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { applicant_scores, ideal_profile, use_python_api } = body;

    if (!applicant_scores || !ideal_profile) {
      return NextResponse.json(
        { error: "Applicant scores and ideal profile are required" },
        { status: 400 }
      );
    }

    // Use TypeScript algorithm by default, optionally fall back to Python API
    if (!use_python_api) {
      try {
        const normalizedProfile = normalizeJobProfile(
          ideal_profile as Record<string, unknown>
        );
        const fitResult = calculateJobFit(
          applicant_scores as DimensionScore[],
          normalizedProfile
        );

        return NextResponse.json({
          fit_result: {
            overall_fit_score: fitResult.overallFit,
            rating: fitResult.rating,
            fit_breakdown: fitResult.breakdown,
            strengths: fitResult.strengths,
            concerns: fitResult.concerns,
            summary: fitResult.summary,
          },
        });
      } catch (tsError) {
        console.error(
          "TypeScript scoring failed, falling back to Python API:",
          tsError
        );
        // Fall through to Python API
      }
    }

    // Fallback: Call Python API to calculate fit score
    const response = await fetch(`${SCORING_API_URL}/api/job-matching/score`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        applicant_scores: applicant_scores,
        ideal_profile: ideal_profile,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      return NextResponse.json(
        { error: "Failed to calculate fit score", details: error },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error calculating fit score:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
