import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const SCORING_API_URL = process.env.NEXT_PUBLIC_SCORING_API_URL || "http://localhost:8000";

/**
 * Re-score an existing assessment using the updated MBTI calculation logic
 * This allows users to get corrected results without retaking the test
 * 
 * Fetches raw responses from Supabase, sends to Python backend for scoring,
 * then updates the results in Supabase.
 * 
 * POST /api/assessment/rescore
 * Body: { sessionId: string } or { userId: string }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, userId, email } = body;

    if (!sessionId && !userId && !email) {
      return NextResponse.json(
        { error: "Either sessionId, userId, or email is required" },
        { status: 400 }
      );
    }

    // Check if Supabase is configured - use service role key for admin operations
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl) {
      return NextResponse.json(
        { error: "Database not configured" },
        { status: 500 }
      );
    }

    // Prefer service role key to bypass RLS, fallback to anon key
    const supabaseKey = supabaseServiceKey || supabaseAnonKey;
    if (!supabaseKey) {
      return NextResponse.json(
        { error: "Database credentials not configured" },
        { status: 500 }
      );
    }

    // Create admin client with service role key (bypasses RLS)
    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // Find the session(s) to re-score
    let sessionsToRescore: string[] = [];
    let userInfo: { id: string; email?: string; clerk_id?: string } | null = null;

    if (sessionId) {
      sessionsToRescore = [sessionId];
    } else if (email) {
      // Find user by email
      const { data: user, error: userError } = await supabase
        .from("users")
        .select("id, email, clerk_id")
        .eq("email", email)
        .single();

      if (userError || !user) {
        return NextResponse.json(
          { error: `No user found with email: ${email}` },
          { status: 404 }
        );
      }

      userInfo = user;

      // Find all sessions for this user
      const { data: sessions, error: sessionError } = await supabase
        .from("assessment_sessions")
        .select("id")
        .eq("user_id", user.id);

      if (sessionError) {
        console.error("Error finding sessions:", sessionError);
        return NextResponse.json(
          { error: "Failed to find user sessions" },
          { status: 500 }
        );
      }

      sessionsToRescore = sessions?.map((s) => s.id) || [];
    } else if (userId) {
      // Find all sessions for this user (by Clerk ID)
      const { data: user } = await supabase
        .from("users")
        .select("id, email, clerk_id")
        .eq("clerk_id", userId)
        .single();

      if (user) {
        userInfo = user;
        
        const { data: sessions, error: sessionError } = await supabase
          .from("assessment_sessions")
          .select("id")
          .eq("user_id", user.id);

        if (sessionError) {
          console.error("Error finding sessions:", sessionError);
          return NextResponse.json(
            { error: "Failed to find user sessions" },
            { status: 500 }
          );
        }

        sessionsToRescore = sessions?.map((s) => s.id) || [];
      }
    }

    if (sessionsToRescore.length === 0) {
      return NextResponse.json(
        { error: "No sessions found to re-score" },
        { status: 404 }
      );
    }

    const results = [];

    for (const sid of sessionsToRescore) {
      // Fetch all responses for this session from Supabase
      const { data: responses, error: responseError } = await supabase
        .from("assessment_responses")
        .select(`
          question_id,
          response,
          dimension,
          question_type
        `)
        .eq("session_id", sid);

      if (responseError) {
        console.error(`Error fetching responses for session ${sid}:`, responseError);
        results.push({ sessionId: sid, status: "error", error: "Failed to fetch responses" });
        continue;
      }

      if (!responses || responses.length === 0) {
        console.log(`No responses found for session ${sid}`);
        results.push({ sessionId: sid, status: "skipped", error: "No responses found" });
        continue;
      }

      // Fetch framework_tags and discrimination for each question
      const questionIds = responses.map((r) => r.question_id);
      const { data: questions } = await supabase
        .from("questions")
        .select("id, framework_tags, discrimination")
        .in("id", questionIds);

      const questionMap = new Map(questions?.map((q) => [q.id, q]) || []);

      // Format responses for the Python scoring API (includes framework_tags)
      const formattedResponses = responses.map((r) => {
        const question = questionMap.get(r.question_id);
        return {
          question_id: r.question_id,
          question_type: r.question_type,
          response: typeof r.response === "object" && r.response !== null && "value" in r.response
            ? (r.response as { value: unknown }).value
            : r.response,
          dimension: r.dimension,
          framework_tags: question?.framework_tags || [],
          discrimination: question?.discrimination || 1.0,
        };
      });

      // Call Python backend for scoring (not mock scoring!)
      let newScores;
      try {
        const scoringResponse = await fetch(`${SCORING_API_URL}/api/scoring/calculate`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            responses: formattedResponses,
            session_id: sid,
            include_frameworks: true,
          }),
        });

        if (!scoringResponse.ok) {
          throw new Error(`Scoring API returned ${scoringResponse.status}`);
        }

        newScores = await scoringResponse.json();
      } catch (apiError) {
        console.error(`Python scoring API error for session ${sid}:`, apiError);
        results.push({ 
          sessionId: sid, 
          status: "error", 
          error: "Scoring API unavailable - ensure Python backend is running" 
        });
        continue;
      }

      // Update the assessment_results table
      const { data: existingResult } = await supabase
        .from("assessment_results")
        .select("id, metadata")
        .eq("session_id", sid)
        .single();

      if (existingResult) {
        // Update existing result
        const { error: updateError } = await supabase
          .from("assessment_results")
          .update({
            dimensional_scores: newScores.dimensional_scores,
            frameworks: newScores.frameworks,
            metadata: {
              ...existingResult.metadata,
              rescored_at: new Date().toISOString(),
              rescore_reason: "MBTI T/F calculation fix",
            },
          })
          .eq("id", existingResult.id);

        if (updateError) {
          console.error(`Error updating results for session ${sid}:`, updateError);
          results.push({ sessionId: sid, status: "error", error: updateError.message });
        } else {
          results.push({ 
            sessionId: sid, 
            status: "updated", 
            newScores: newScores.dimensional_scores,
            mbti: newScores.frameworks?.mbti,
          });
        }
      } else {
        // Insert new result if somehow missing
        const { error: insertError } = await supabase
          .from("assessment_results")
          .insert({
            session_id: sid,
            dimensional_scores: newScores.dimensional_scores,
            frameworks: newScores.frameworks,
            completed: true,
            metadata: {
              rescored_at: new Date().toISOString(),
              rescore_reason: "MBTI T/F calculation fix",
            },
          });

        if (insertError) {
          console.error(`Error inserting results for session ${sid}:`, insertError);
          results.push({ sessionId: sid, status: "error", error: insertError.message });
        } else {
          results.push({ 
            sessionId: sid, 
            status: "created", 
            newScores: newScores.dimensional_scores,
            mbti: newScores.frameworks?.mbti,
          });
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: `Re-scored ${results.filter((r) => r.status !== "error").length} of ${sessionsToRescore.length} sessions`,
      results,
    });
  } catch (error) {
    console.error("Error re-scoring assessment:", error);
    return NextResponse.json(
      { error: "Failed to re-score assessment" },
      { status: 500 }
    );
  }
}

