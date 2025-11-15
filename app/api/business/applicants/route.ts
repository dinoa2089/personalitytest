import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { supabase } from "@/lib/supabase";

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
      .order("fit_score", { ascending: false, nullsLast: true });

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
      // Calculate fit score
      try {
        const fitResponse = await fetch(
          `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/business/applicants/score`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              applicant_scores: result.dimensional_scores,
              ideal_profile: jobPosting.ideal_profile,
            }),
          }
        );

        if (fitResponse.ok) {
          const fitData = await fitResponse.json();
          fitScore = fitData.fit_result.overall_fit_score;
          fitBreakdown = fitData.fit_result.fit_breakdown;
        }
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

