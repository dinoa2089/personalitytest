import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import fixedForcedChoice from "@/scripts/fixed-forced-choice-questions.json";
import fixedLikert from "@/scripts/fixed-likert-questions.json";

interface LikertQuestion {
  id: string;
  dimension: string;
  text: string;
  reverse_scored: boolean;
  framework_tags: string[];
}

interface ForcedChoiceQuestion {
  id: string;
  dimension: string;
  text: string;
  options: Array<{ text: string; dimension: string }>;
}

/**
 * Update questions with fixed text and framework tags
 * POST /api/admin/update-questions?type=likert|forced_choice|all
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

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || "all";

    const results: Array<{ id: string; type: string; status: string; error?: string }> = [];

    // Update forced-choice questions
    if (type === "forced_choice" || type === "all") {
      for (const q of fixedForcedChoice.questions as ForcedChoiceQuestion[]) {
        const { error } = await supabase
          .from("questions")
          .update({
            text: q.text,
            options: q.options,
          })
          .eq("id", q.id);

        if (error) {
          results.push({ id: q.id, type: "forced_choice", status: "error", error: error.message });
        } else {
          results.push({ id: q.id, type: "forced_choice", status: "updated" });
        }
      }
    }

    // Update likert questions
    if (type === "likert" || type === "all") {
      for (const q of fixedLikert.questions as LikertQuestion[]) {
        const { error } = await supabase
          .from("questions")
          .update({
            text: q.text,
            reverse_scored: q.reverse_scored,
            framework_tags: q.framework_tags,
          })
          .eq("id", q.id);

        if (error) {
          results.push({ id: q.id, type: "likert", status: "error", error: error.message });
        } else {
          results.push({ id: q.id, type: "likert", status: "updated" });
        }
      }
    }

    const successCount = results.filter((r) => r.status === "updated").length;
    const errorCount = results.filter((r) => r.status === "error").length;

    return NextResponse.json({
      success: true,
      message: `Updated ${successCount} questions, ${errorCount} errors`,
      summary: {
        forced_choice: results.filter((r) => r.type === "forced_choice" && r.status === "updated").length,
        likert: results.filter((r) => r.type === "likert" && r.status === "updated").length,
        errors: errorCount,
      },
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
  const likertWithTags = (fixedLikert.questions as LikertQuestion[]).filter(
    (q) => q.framework_tags && q.framework_tags.length > 1
  );

  return NextResponse.json({
    forced_choice: {
      description: fixedForcedChoice.description,
      count: fixedForcedChoice.questions.length,
      preview: fixedForcedChoice.questions.slice(0, 3).map((q: any) => ({
        id: q.id,
        dimension: q.dimension,
        newText: q.text,
        optionCount: q.options.length,
      })),
    },
    likert: {
      description: fixedLikert.description,
      count: fixedLikert.questions.length,
      withMbtiTags: (fixedLikert.questions as LikertQuestion[]).filter((q) =>
        q.framework_tags?.some((t) => t.startsWith("mbti_"))
      ).length,
      withEnneagramTags: (fixedLikert.questions as LikertQuestion[]).filter((q) =>
        q.framework_tags?.some((t) => t.startsWith("enneagram_"))
      ).length,
      preview: likertWithTags.slice(0, 5).map((q) => ({
        id: q.id,
        dimension: q.dimension,
        text: q.text,
        framework_tags: q.framework_tags,
      })),
    },
  });
}
