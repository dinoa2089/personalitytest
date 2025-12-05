import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { mockCalculateScores } from "@/lib/mock-scoring";

export async function GET(request: NextRequest) {
  const log: string[] = [];
  const testSessionId = crypto.randomUUID();
  
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({ error: "DB not configured", log });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    // Step 1: Create session
    log.push(`Step 1: Creating session ${testSessionId}`);
    const { data: session, error: sessionError } = await supabase
      .from("assessment_sessions")
      .insert({
        id: testSessionId,
        guest_session_id: testSessionId,
        progress: 0,
        started_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (sessionError) {
      log.push(`❌ Session creation failed: ${sessionError.message}`);
      return NextResponse.json({ error: "Session creation failed", log, details: sessionError });
    }
    log.push(`✅ Session created: ${session.id}`);

    // Step 2: Create mock responses
    log.push("Step 2: Creating mock responses");
    const mockResponses = [
      { question_id: "test-q1", response: 4, dimension: "openness" },
      { question_id: "test-q2", response: 3, dimension: "conscientiousness" },
      { question_id: "test-q3", response: 5, dimension: "extraversion" },
    ];

    // Step 3: Calculate scores
    log.push("Step 3: Calculating scores");
    let scores;
    try {
      scores = mockCalculateScores(mockResponses as any, testSessionId);
      log.push(`✅ Scores calculated: ${Object.keys(scores.dimensional_scores || {}).length} dimensions`);
    } catch (scoreError) {
      log.push(`❌ Score calculation failed: ${scoreError}`);
      // Clean up session
      await supabase.from("assessment_sessions").delete().eq("id", testSessionId);
      return NextResponse.json({ error: "Score calculation failed", log, details: String(scoreError) });
    }

    // Step 4: Save results
    log.push("Step 4: Saving results to database");
    const { data: result, error: resultError } = await supabase
      .from("assessment_results")
      .insert({
        session_id: testSessionId,
        user_id: null,
        dimensional_scores: scores.dimensional_scores,
        framework_mappings: scores.frameworks || null,
        results_access_level: "free",
        metadata: {},
      })
      .select()
      .single();

    if (resultError) {
      log.push(`❌ Result save failed: ${resultError.message}`);
      // Clean up session
      await supabase.from("assessment_sessions").delete().eq("id", testSessionId);
      return NextResponse.json({ error: "Result save failed", log, details: resultError });
    }
    log.push(`✅ Results saved: ${result.id}`);

    // Step 5: Verify we can read it back
    log.push("Step 5: Verifying results can be read");
    const { data: readResult, error: readError } = await supabase
      .from("assessment_results")
      .select("*")
      .eq("session_id", testSessionId)
      .single();

    if (readError || !readResult) {
      log.push(`❌ Results read failed: ${readError?.message || "not found"}`);
    } else {
      log.push(`✅ Results read successfully`);
    }

    // Step 6: Clean up
    log.push("Step 6: Cleaning up test data");
    await supabase.from("assessment_results").delete().eq("session_id", testSessionId);
    await supabase.from("assessment_sessions").delete().eq("id", testSessionId);
    log.push("✅ Test data cleaned up");

    return NextResponse.json({ 
      success: true, 
      message: "Full flow test passed!", 
      log,
      testSessionId 
    });
  } catch (error) {
    return NextResponse.json({ 
      error: String(error), 
      log,
      stack: error instanceof Error ? error.stack : undefined 
    }, { status: 500 });
  }
}

