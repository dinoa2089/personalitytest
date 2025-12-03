import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json(
        { error: "Token is required" },
        { status: 400 }
      );
    }

    // First, try to find the token in job_assessment_links table (new system)
    const { data: linkData } = await supabase
      .from("job_assessment_links")
      .select(`
        *,
        job_postings (
          id,
          title,
          business_id,
          ideal_profile,
          business_accounts (
            company_name
          )
        )
      `)
      .eq("token", token)
      .single();

    if (linkData) {
      // Validate link is active
      if (!linkData.is_active) {
        return NextResponse.json(
          { error: "This assessment link has been deactivated" },
          { status: 410 }
        );
      }

      // Check expiration
      if (linkData.expires_at && new Date(linkData.expires_at) < new Date()) {
        return NextResponse.json(
          { error: "This assessment link has expired" },
          { status: 410 }
        );
      }

      // Check max uses
      if (linkData.max_uses && linkData.current_uses >= linkData.max_uses) {
        return NextResponse.json(
          { error: "This assessment link has reached its maximum number of uses" },
          { status: 410 }
        );
      }

      const jobPosting = linkData.job_postings;
      if (!jobPosting) {
        return NextResponse.json(
          { error: "Job posting not found" },
          { status: 404 }
        );
      }

      // Handle Supabase nested response structure
      const businessAccounts = jobPosting.business_accounts as { company_name?: string } | { company_name?: string }[] | null;
      const companyName = Array.isArray(businessAccounts)
        ? businessAccounts[0]?.company_name
        : businessAccounts?.company_name;

      return NextResponse.json({
        valid: true,
        job_posting: {
          id: jobPosting.id,
          title: jobPosting.title,
          business_id: jobPosting.business_id,
          company_name: companyName,
        },
        link_info: {
          current_uses: linkData.current_uses,
          max_uses: linkData.max_uses,
          expires_at: linkData.expires_at,
        },
      });
    }

    // Fallback: Check legacy assessment_link_token on job_postings table
    const { data: jobPosting, error } = await supabase
      .from("job_postings")
      .select(`
        id, 
        title, 
        business_id,
        business_accounts (
          company_name
        )
      `)
      .eq("assessment_link_token", token)
      .single();

    if (error || !jobPosting) {
      return NextResponse.json(
        { error: "Invalid or expired assessment link" },
        { status: 404 }
      );
    }

    // Handle Supabase nested response structure
    const businessAccounts = jobPosting.business_accounts as { company_name?: string } | { company_name?: string }[] | null;
    const companyName = Array.isArray(businessAccounts) 
      ? businessAccounts[0]?.company_name
      : businessAccounts?.company_name;

    return NextResponse.json({ 
      valid: true,
      job_posting: {
        id: jobPosting.id,
        title: jobPosting.title,
        business_id: jobPosting.business_id,
        company_name: companyName,
      },
    });
  } catch (error) {
    console.error("Error fetching job posting by token:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
