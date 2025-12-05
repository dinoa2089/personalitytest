import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId } = await params;

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    // Check session
    const { data: session, error: sessionError } = await supabase
      .from("assessment_sessions")
      .select("*")
      .eq("id", sessionId)
      .single();

    // Check results
    const { data: results, error: resultsError } = await supabase
      .from("assessment_results")
      .select("id, session_id, created_at, dimensional_scores")
      .eq("session_id", sessionId)
      .single();

    // Check responses count
    const { count: responsesCount } = await supabase
      .from("assessment_responses")
      .select("*", { count: "exact", head: true })
      .eq("session_id", sessionId);

    return NextResponse.json({
      sessionId,
      session: session || null,
      sessionError: sessionError?.message || null,
      results: results ? { id: results.id, hasScores: !!results.dimensional_scores } : null,
      resultsError: resultsError?.message || null,
      responsesCount: responsesCount || 0,
    });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

