import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId } = await params;

    // Check if Supabase is configured
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseKey) {
      const { data: result, error } = await supabase
        .from("assessment_results")
        .select(`
          *,
          metadata
        `)
        .eq("session_id", sessionId)
        .single();

      if (!error && result) {
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
      }
    }

    // If Supabase not configured or result not found, return 404
    // Frontend will handle this gracefully
    return NextResponse.json({ error: "Results not found" }, { status: 404 });
  } catch (error) {
    console.error("Error fetching results:", error);
    return NextResponse.json(
      { error: "Failed to fetch results" },
      { status: 500 }
    );
  }
}

