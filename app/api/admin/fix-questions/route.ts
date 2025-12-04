import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

/**
 * Fix badly worded questions in the database
 * Removes "particularly with organization" phrase that makes no sense
 * 
 * POST /api/admin/fix-questions
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

    // Find all questions with the bad phrase
    const { data: questions, error: fetchError } = await supabase
      .from("questions")
      .select("id, text")
      .ilike("text", "%particularly with organization%");

    if (fetchError) {
      return NextResponse.json(
        { error: "Failed to fetch questions", details: fetchError.message },
        { status: 500 }
      );
    }

    if (!questions || questions.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No questions found with the bad phrase",
        fixed: 0,
      });
    }

    // Fix each question
    const fixes = [];
    for (const q of questions) {
      const fixedText = q.text
        .replace(/ particularly with organization,/gi, ",")
        .replace(/ particularly with organization/gi, "");

      const { error: updateError } = await supabase
        .from("questions")
        .update({ text: fixedText })
        .eq("id", q.id);

      if (updateError) {
        fixes.push({ id: q.id, status: "error", error: updateError.message });
      } else {
        fixes.push({ id: q.id, status: "fixed", before: q.text, after: fixedText });
      }
    }

    return NextResponse.json({
      success: true,
      message: `Fixed ${fixes.filter(f => f.status === "fixed").length} of ${questions.length} questions`,
      fixes,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fix questions", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}


