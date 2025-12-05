import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId } = await params;
    const { searchParams } = new URL(request.url);
    const checkpoint = searchParams.get("checkpoint");

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

    // Fetch results by session_id including framework_mappings
    const { data: result, error } = await supabase
      .from("assessment_results")
      .select(`
        *,
        metadata,
        framework_mappings
      `)
      .eq("session_id", sessionId)
      .single();

    if (error || !result) {
      console.error("Results not found:", error?.message || "No result for session", sessionId);
      return NextResponse.json({ error: "Results not found" }, { status: 404 });
    }

    // For checkpoint-specific requests, filter frameworks based on stage
    let frameworks = result.framework_mappings || null;
    if (checkpoint) {
      const checkpointNum = parseInt(checkpoint);
      // Filter frameworks based on what's available at this checkpoint
      if (frameworks) {
        // Checkpoint 1: Only PRISM (base dimensions), no MBTI/Enneagram yet
        // Checkpoint 2+: MBTI available
        // Checkpoint 3+: Enneagram available
        // Checkpoint 4: Everything including detailed facets
        frameworks = {
          ...frameworks,
          mbti: checkpointNum >= 2 ? frameworks.mbti : undefined,
          enneagram: checkpointNum >= 3 ? frameworks.enneagram : undefined,
          dark_triad: checkpointNum >= 4 ? frameworks.dark_triad : undefined,
        };
      }
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
          frameworks,
          mbti: frameworks?.mbti,
          enneagram: frameworks?.enneagram,
          fit_score: applicantAssessment.fit_score,
          fit_breakdown: applicantAssessment.fit_breakdown,
          job_info: {
            title: jobPosting?.title,
            company_name: companyName,
          },
        });
      }
    }

    // Map framework_mappings to frameworks for frontend compatibility
    const responseData = {
      ...result,
      frameworks,
      mbti: frameworks?.mbti,
      enneagram: frameworks?.enneagram,
    };
    return NextResponse.json(responseData);
  } catch (error) {
    console.error("Error fetching results:", error);
    return NextResponse.json(
      { error: "Failed to fetch results" },
      { status: 500 }
    );
  }
}
