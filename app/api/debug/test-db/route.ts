import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(request: NextRequest) {
  const results: Record<string, unknown> = {};
  
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    results.hasUrl = !!supabaseUrl;
    results.hasServiceKey = !!supabaseServiceKey;
    results.serviceKeyPrefix = supabaseServiceKey?.substring(0, 20) + "...";

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({ ...results, error: "Missing env vars" }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    // Test 1: Can we query questions?
    const { data: questions, error: questionsError } = await supabase
      .from("questions")
      .select("id")
      .limit(1);
    
    results.questionsQuery = questionsError ? questionsError.message : `Found ${questions?.length} questions`;

    // Test 2: Can we query sessions?
    const { data: sessions, error: sessionsError } = await supabase
      .from("assessment_sessions")
      .select("id")
      .limit(5);
    
    results.sessionsQuery = sessionsError ? sessionsError.message : `Found ${sessions?.length} sessions`;
    results.sessionIds = sessions?.map(s => s.id) || [];

    // Test 3: Can we query results?
    const { data: allResults, error: resultsError } = await supabase
      .from("assessment_results")
      .select("id, session_id")
      .limit(5);
    
    results.resultsQuery = resultsError ? resultsError.message : `Found ${allResults?.length} results`;
    results.resultSessionIds = allResults?.map(r => r.session_id) || [];

    // Test 4: Try to create a test session
    const testSessionId = "test-" + Date.now();
    const { data: newSession, error: createError } = await supabase
      .from("assessment_sessions")
      .insert({
        id: testSessionId,
        guest_session_id: testSessionId,
        progress: 0,
        started_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (createError) {
      results.createSession = `Error: ${createError.message}`;
    } else {
      results.createSession = `Success! Created session ${newSession?.id}`;
      
      // Clean up test session
      await supabase.from("assessment_sessions").delete().eq("id", testSessionId);
      results.cleanup = "Test session deleted";
    }

    // Test 5: Check users table
    const { data: users, error: usersError } = await supabase
      .from("users")
      .select("id, email")
      .limit(5);
    
    results.usersQuery = usersError ? usersError.message : `Found ${users?.length} users`;
    results.userEmails = users?.map(u => u.email) || [];

    return NextResponse.json(results);
  } catch (error) {
    return NextResponse.json({ 
      ...results, 
      error: String(error),
      stack: error instanceof Error ? error.stack : undefined 
    }, { status: 500 });
  }
}

