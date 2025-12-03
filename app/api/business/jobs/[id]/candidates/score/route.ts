import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { supabase } from "@/lib/supabase";
import { calculateJobFit, normalizeJobProfile } from "@/lib/job-fit-scoring";
import type { DimensionScore } from "@/types";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { sessionId } = await request.json();

    if (!sessionId) {
      return NextResponse.json(
        { error: "sessionId is required" },
        { status: 400 }
      );
    }

    // Get job profile from job_postings (using ideal_profile field)
    const { data: job, error: jobError } = await supabase
      .from("job_postings")
      .select("id, title, ideal_profile")
      .eq("id", id)
      .single();

    if (jobError || !job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    if (!job.ideal_profile) {
      return NextResponse.json(
        { error: "Job profile not configured" },
        { status: 400 }
      );
    }

    // Get candidate's assessment results
    const { data: result, error: resultError } = await supabase
      .from("assessment_results")
      .select("dimensional_scores")
      .eq("session_id", sessionId)
      .single();

    if (resultError || !result) {
      return NextResponse.json(
        { error: "Assessment not found" },
        { status: 404 }
      );
    }

    // Normalize the job profile to expected format
    const normalizedProfile = normalizeJobProfile(
      job.ideal_profile as Record<string, unknown>
    );

    // Calculate fit using the TypeScript algorithm
    const fitResult = calculateJobFit(
      result.dimensional_scores as DimensionScore[],
      normalizedProfile
    );

    // Update applicant_assessments record if it exists
    const { error: updateError } = await supabase
      .from("applicant_assessments")
      .update({
        fit_score: fitResult.overallFit,
        fit_breakdown: fitResult,
        updated_at: new Date().toISOString(),
      })
      .eq("job_posting_id", id)
      .eq("assessment_session_id", sessionId);

    if (updateError) {
      console.error("Error updating applicant assessment:", updateError);
      // Don't fail the request, just log the error
    }

    return NextResponse.json({
      fit: fitResult,
      job: {
        id: job.id,
        title: job.title,
      },
    });
  } catch (error) {
    console.error("Error calculating job fit:", error);
    return NextResponse.json(
      {
        error: "Failed to calculate fit score",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

/**
 * GET endpoint to retrieve cached fit score for a candidate
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("sessionId");

    if (!sessionId) {
      return NextResponse.json(
        { error: "sessionId query parameter is required" },
        { status: 400 }
      );
    }

    // Get applicant assessment with fit data
    const { data: applicant, error } = await supabase
      .from("applicant_assessments")
      .select("fit_score, fit_breakdown")
      .eq("job_posting_id", id)
      .eq("assessment_session_id", sessionId)
      .single();

    if (error || !applicant) {
      return NextResponse.json(
        { error: "Candidate assessment not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      fit: applicant.fit_breakdown,
      fitScore: applicant.fit_score,
    });
  } catch (error) {
    console.error("Error fetching fit score:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

