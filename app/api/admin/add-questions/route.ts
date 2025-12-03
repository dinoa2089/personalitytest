import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import newQuestions from "@/scripts/new-enneagram-questions.json";

export async function POST() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({ error: "Database not configured" }, { status: 503 });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    // Get current max ID to generate new IDs
    const { data: existingQuestions } = await supabase
      .from("questions")
      .select("id")
      .order("id", { ascending: false })
      .limit(1);

    // Generate new question IDs starting after the last one
    let nextId = 400; // Start from 400 to be safe
    if (existingQuestions && existingQuestions.length > 0) {
      const lastId = parseInt(existingQuestions[0].id.replace(/\D/g, "") || "0");
      nextId = Math.max(nextId, lastId + 1);
    }

    const questionsToInsert = newQuestions.questions.map((q, index) => ({
      id: `q${nextId + index}`,
      text: q.text,
      type: q.type,
      dimension: q.dimension,
      framework_tags: q.framework_tags,
      discrimination: q.discrimination || 1.0,
      difficulty: 0,
      reverse_scored: q.reverse_scored || false,
      response_count: 0,
      options: null, // For likert questions, options are implied
    }));

    // Insert questions
    const { data, error } = await supabase
      .from("questions")
      .insert(questionsToInsert)
      .select();

    if (error) {
      console.error("Error inserting questions:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Count by type for verification
    const countsByType: Record<string, number> = {};
    questionsToInsert.forEach(q => {
      q.framework_tags?.forEach((tag: string) => {
        countsByType[tag] = (countsByType[tag] || 0) + 1;
      });
    });

    return NextResponse.json({
      success: true,
      inserted: data?.length || questionsToInsert.length,
      countsByType,
      message: `Successfully added ${questionsToInsert.length} new Enneagram questions`,
    });
  } catch (error) {
    console.error("Exception adding questions:", error);
    return NextResponse.json(
      { error: "Failed to add questions", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

