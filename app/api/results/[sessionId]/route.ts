import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId } = await params;

    // Use service role key to bypass RLS
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // Fetch results by session_id
    const { data: result, error } = await supabase
      .from("assessment_results")
      .select(`
        *,
        metadata
      `)
      .eq("session_id", sessionId)
      .single();

    if (error || !result) {
      console.error("Results not found:", error?.message || "No result for session", sessionId);
      return NextResponse.json({ error: "Results not found" }, { status: 404 });
    }

    // If this is a business assessment, fetch applicant assessment details
    if (result.metadata?.applicant_assessment_id) {
      const { data: applicantAssessment } = await supabase
        .from("applicant_assessments")
        .select(`
          fit_score,
          fit_breakdown,
          job_postings (
            id,
            title,
            business_accounts (
              company_name
            )
          )
        `)
        .eq("id", result.metadata.applicant_assessment_id)
        .single();

      if (applicantAssessment) {
        // Handle Supabase nested response - could be array or object
        const jobPosting = Array.isArray(applicantAssessment.job_postings)
          ? applicantAssessment.job_postings[0]
          : applicantAssessment.job_postings;
        const businessAccount = jobPosting?.business_accounts;
        const companyName = Array.isArray(businessAccount)
          ? businessAccount[0]?.company_name
          : (businessAccount as { company_name?: string } | null)?.company_name;

        return NextResponse.json({
          ...result,
          fit_score: applicantAssessment.fit_score,
          fit_breakdown: applicantAssessment.fit_breakdown,
          job_info: {
            title: jobPosting?.title,
            company_name: companyName,
          },
        });
      }
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching results:", error);
    return NextResponse.json(
      { error: "Failed to fetch results" },
      { status: 500 }
    );
  }
}
