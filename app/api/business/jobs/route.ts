import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { supabase } from "@/lib/supabase";

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
    const { title, description, ideal_profile, business_id } = body;

    if (!title || !description || !business_id) {
      return NextResponse.json(
        { error: "Title, description, and business_id are required" },
        { status: 400 }
      );
    }

    // Generate unique assessment link token
    const assessmentLinkToken = Array.from(crypto.getRandomValues(new Uint8Array(16)))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');

    const { data: jobPosting, error } = await supabase
      .from("job_postings")
      .insert({
        business_id: business_id,
        title: title,
        description: description,
        ideal_profile: ideal_profile || null,
        assessment_link_token: assessmentLinkToken,
        status: "draft",
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating job posting:", error);
      return NextResponse.json(
        { error: "Failed to create job posting" },
        { status: 500 }
      );
    }

    return NextResponse.json({ job_posting: jobPosting });
  } catch (error) {
    console.error("Error in job posting creation:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

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
    const businessId = searchParams.get("business_id");

    if (!businessId) {
      return NextResponse.json(
        { error: "business_id is required" },
        { status: 400 }
      );
    }

    const { data: jobPostings, error } = await supabase
      .from("job_postings")
      .select("*")
      .eq("business_id", businessId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching job postings:", error);
      return NextResponse.json(
        { error: "Failed to fetch job postings" },
        { status: 500 }
      );
    }

    return NextResponse.json({ job_postings: jobPostings || [] });
  } catch (error) {
    console.error("Error fetching job postings:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

