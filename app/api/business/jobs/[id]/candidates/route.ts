import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { supabase } from "@/lib/supabase";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: jobId } = await params;
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const sortBy = searchParams.get("sortBy") || "fit_score";
    const sortOrder = searchParams.get("order") || "desc";
    const status = searchParams.get("status");
    const minFit = searchParams.get("minFit");

    let query = supabase
      .from("applicant_assessments")
      .select(`
        *,
        assessment_sessions (
          id,
          completed_at
        )
      `)
      .eq("job_posting_id", jobId);

    // Apply filters
    if (status && status !== "all") {
      if (status === "shortlisted") {
        query = query.eq("shortlisted", true);
      } else {
        query = query.eq("status", status);
      }
    }

    if (minFit) {
      query = query.gte("fit_score", parseInt(minFit));
    }

    // Apply sorting
    const ascending = sortOrder === "asc";
    if (sortBy === "fit_score") {
      query = query.order("fit_score", { ascending, nullsFirst: false });
    } else if (sortBy === "created_at") {
      query = query.order("created_at", { ascending });
    } else if (sortBy === "applicant_name") {
      query = query.order("applicant_name", { ascending, nullsFirst: false });
    } else {
      query = query.order(sortBy, { ascending });
    }

    const { data: candidates, error } = await query;

    if (error) {
      console.error("Error fetching candidates:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Calculate stats
    const candidateList = candidates || [];
    const withScores = candidateList.filter(c => c.fit_score !== null);
    
    const stats = {
      total: candidateList.length,
      pending: candidateList.filter(c => c.status === "pending").length,
      reviewed: candidateList.filter(c => c.status === "reviewed").length,
      completed: candidateList.filter(c => c.status === "completed").length,
      shortlisted: candidateList.filter(c => c.shortlisted).length,
      avgFit: withScores.length > 0
        ? Math.round(withScores.reduce((sum, c) => sum + (c.fit_score || 0), 0) / withScores.length)
        : 0,
      topMatches: candidateList.filter(c => c.fit_score !== null && c.fit_score >= 85).length,
    };

    return NextResponse.json({ candidates: candidateList, stats });
  } catch (error) {
    console.error("Error in candidates API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}


