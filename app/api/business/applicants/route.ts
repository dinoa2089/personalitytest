import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { supabase } from "@/lib/supabase";
import { calculateJobFit, normalizeJobProfile } from "@/lib/job-fit-scoring";
import type { DimensionScore } from "@/types";

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const jobPostingId = searchParams.get("job_posting_id");

    if (!jobPostingId) {
      return NextResponse.json(
        { error: "job_posting_id is required" },
        { status: 400 }
      );
    }

    const { data: applicants, error } = await supabase
      .from("applicant_assessments")
      .select(`
        *,
        assessment_sessions (
          id,
          completed_at
        )
      `)
      .eq("job_posting_id", jobPostingId)
      .order("fit_score", { ascending: false, nullsFirst: false });

    if (error) {
      console.error("Error fetching applicants:", error);
      return NextResponse.json(
        { error: "Failed to fetch applicants" },
        { status: 500 }
      );
    }

    return NextResponse.json({ applicants: applicants || [] });
  } catch (error) {
    console.error("Error fetching applicants:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
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

    const body = await request.json();
    const { job_posting_id, applicant_email, applicant_name, assessment_session_id } = body;

    if (!job_posting_id || !assessment_session_id) {
      return NextResponse.json(
        { error: "job_posting_id and assessment_session_id are required" },
        { status: 400 }
      );
    }

    // Get assessment results to calculate fit score
    const { data: result } = await supabase
      .from("assessment_results")
      .select("dimensional_scores")
      .eq("session_id", assessment_session_id)
      .single();

    if (!result) {
      return NextResponse.json(
        { error: "Assessment results not found" },
        { status: 404 }
      );
    }

    // Get job posting to get ideal profile
    const { data: jobPosting } = await supabase
      .from("job_postings")
      .select("ideal_profile")
      .eq("id", job_posting_id)
      .single();

    let fitScore = null;
    let fitBreakdown = null;

    if (jobPosting?.ideal_profile && result.dimensional_scores) {
      // Calculate fit score using TypeScript algorithm
      try {
        const normalizedProfile = normalizeJobProfile(
          jobPosting.ideal_profile as Record<string, unknown>
        );
        const fitResult = calculateJobFit(
          result.dimensional_scores as DimensionScore[],
          normalizedProfile
        );
        fitScore = fitResult.overallFit;
        fitBreakdown = fitResult;
      } catch (error) {
        console.error("Error calculating fit score:", error);
        // Continue without fit score
      }
    }

    const { data: applicant, error } = await supabase
      .from("applicant_assessments")
      .insert({
        job_posting_id: job_posting_id,
        applicant_email: applicant_email || null,
        applicant_name: applicant_name || null,
        assessment_session_id: assessment_session_id,
        fit_score: fitScore,
        fit_breakdown: fitBreakdown,
        status: "completed",
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating applicant assessment:", error);
      return NextResponse.json(
        { error: "Failed to create applicant assessment" },
        { status: 500 }
      );
    }

    return NextResponse.json({ applicant });
  } catch (error) {
    console.error("Error creating applicant assessment:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

