import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

/**
 * Export all questions from Supabase for audit
 * GET /api/admin/export-questions
 */
export async function GET(request: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json(
        { error: "Database not configured" },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // Fetch all questions
    const { data: questions, error } = await supabase
      .from("questions")
      .select("*")
      .order("id");

    if (error) {
      return NextResponse.json(
        { error: "Failed to fetch questions", details: error.message },
        { status: 500 }
      );
    }

    // Group by type for summary
    const summary = {
      total: questions?.length || 0,
      byType: {} as Record<string, number>,
      byDimension: {} as Record<string, number>,
    };

    questions?.forEach(q => {
      summary.byType[q.type] = (summary.byType[q.type] || 0) + 1;
      summary.byDimension[q.dimension] = (summary.byDimension[q.dimension] || 0) + 1;
    });

    return NextResponse.json({
      summary,
      questions,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to export questions", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}


