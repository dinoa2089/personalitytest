import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import fixedQuestions from "@/scripts/fixed-forced-choice-questions.json";

/**
 * Update forced-choice questions with fixed text and options
 * POST /api/admin/update-questions
 */
export async function POST(request: NextRequest) {
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

    const results: Array<{id: string; status: string; error?: string}> = [];

    for (const q of fixedQuestions.questions) {
      const { error } = await supabase
        .from("questions")
        .update({
          text: q.text,
          options: q.options,
        })
        .eq("id", q.id);

      if (error) {
        results.push({ id: q.id, status: "error", error: error.message });
      } else {
        results.push({ id: q.id, status: "updated" });
      }
    }

    const successCount = results.filter(r => r.status === "updated").length;
    const errorCount = results.filter(r => r.status === "error").length;

    return NextResponse.json({
      success: true,
      message: `Updated ${successCount} questions, ${errorCount} errors`,
      results,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update questions", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

/**
 * Preview the changes without applying
 * GET /api/admin/update-questions
 */
export async function GET(request: NextRequest) {
  return NextResponse.json({
    description: fixedQuestions.description,
    count: fixedQuestions.questions.length,
    preview: fixedQuestions.questions.slice(0, 5).map(q => ({
      id: q.id,
      dimension: q.dimension,
      newText: q.text,
      optionCount: q.options.length,
    })),
  });
}

