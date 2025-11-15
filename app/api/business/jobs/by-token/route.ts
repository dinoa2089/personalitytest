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
        { error: "Job posting not found" },
        { status: 404 }
      );
    }

    // Handle Supabase nested response structure
    const companyName = Array.isArray(jobPosting.business_accounts) 
      ? jobPosting.business_accounts[0]?.company_name
      : jobPosting.business_accounts?.company_name;

    return NextResponse.json({ 
      job_posting: {
        id: jobPosting.id,
        title: jobPosting.title,
        business_id: jobPosting.business_id,
        company_name: companyName,
      }
    });
  } catch (error) {
    console.error("Error fetching job posting by token:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

