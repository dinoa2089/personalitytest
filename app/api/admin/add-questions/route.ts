import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import enneagramQuestions from "@/scripts/new-enneagram-questions.json";
import mbtiSnQuestions from "@/scripts/new-mbti-sn-questions.json";
import darkTriadQuestions from "@/scripts/new-dark-triad-questions.json";

interface QuestionInput {
  text: string;
  type: string;
  dimension: string;
  framework_tags: string[];
  discrimination?: number;
  reverse_scored?: boolean;
}

export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const questionSet = searchParams.get("set") || "enneagram";

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({ error: "Database not configured" }, { status: 503 });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    // Select which questions to add based on the set parameter
    let questions: QuestionInput[];
    let setName: string;
    
    switch (questionSet) {
      case "mbti_sn":
        questions = mbtiSnQuestions.questions;
        setName = "MBTI S/N";
        break;
      case "dark_triad":
        questions = darkTriadQuestions.questions;
        setName = "Dark Triad";
        break;
      case "enneagram":
      default:
        questions = enneagramQuestions.questions;
        setName = "Enneagram";
        break;
    }

    const questionsToInsert = questions.map((q) => ({
      id: crypto.randomUUID(),
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
      message: `Successfully added ${questionsToInsert.length} new ${setName} questions`,
    });
  } catch (error) {
    console.error("Exception adding questions:", error);
    return NextResponse.json(
      { error: "Failed to add questions", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
