import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, questionId, response, dimension, questionType, totalQuestions, currentProgress } = body;

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      // Supabase not configured - return success (graceful degradation)
      return NextResponse.json({ success: true, message: "Supabase not configured" });
    }

    // Save response (response must be JSONB)
    const { data, error } = await supabase
      .from("assessment_responses")
      .insert({
        session_id: sessionId,
        question_id: questionId,
        response: typeof response === "object" ? response : { value: response }, // Ensure JSONB format
        dimension: dimension,
        question_type: questionType,
      })
      .select()
      .single();

    if (error) {
      console.error("Error saving response:", error);
      // Don't fail completely - allow assessment to continue
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    // Update session progress if provided
    if (totalQuestions && currentProgress !== undefined) {
      const progressPercent = Math.round((currentProgress / totalQuestions) * 100);
      
      await supabase
        .from("assessment_sessions")
        .update({
          progress: progressPercent,
          updated_at: new Date().toISOString(),
        })
        .eq("id", sessionId);
    }

    return NextResponse.json({ success: true, response: data });
  } catch (error) {
    console.error("Exception saving response:", error);
    return NextResponse.json(
      { success: false, error: "Failed to save response" },
      { status: 500 }
    );
  }
}

