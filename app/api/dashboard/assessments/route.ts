import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

/**
 * Get user's assessment history
 * For authenticated users: fetches by user_id
 * For guest users: fetches by guest_session_id
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const guestSessionId = searchParams.get("guestSessionId");

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ assessments: [] });
    }

    let query = supabase
      .from("assessment_sessions")
      .select(`
        id,
        started_at,
        completed_at,
        progress,
        guest_session_id,
        assessment_results (
          id,
          dimensional_scores,
          created_at
        )
      `)
      .order("started_at", { ascending: false })
      .limit(50);

    if (userId) {
      // Get user_id from users table by clerk_id
      const { data: user } = await supabase
        .from("users")
        .select("id")
        .eq("clerk_id", userId)
        .single();

      if (user) {
        query = query.eq("user_id", user.id);
      } else {
        // User not found in database yet (Clerk not set up or user not synced)
        // Return empty array - user can still use guest mode
        return NextResponse.json({ assessments: [] });
      }
    } else if (guestSessionId) {
      // Guest user - find all sessions with this guest_session_id
      // Note: We need to find sessions where guest_session_id matches OR id matches
      // (since guest_session_id might be stored in the id field)
      query = query.or(`guest_session_id.eq.${guestSessionId},id.eq.${guestSessionId}`);
    } else {
      return NextResponse.json({ error: "userId or guestSessionId required" }, { status: 400 });
    }

    const { data: sessions, error } = await query;

    if (error) {
      console.error("Error fetching assessments:", error);
      return NextResponse.json({ assessments: [] });
    }

    // Format the data for frontend
    const assessments = (sessions || []).map((session: any) => ({
      id: session.id,
      sessionId: session.id,
      startedAt: session.started_at,
      completedAt: session.completed_at,
      progress: session.progress,
      isComplete: !!session.completed_at,
      hasResults: session.assessment_results && session.assessment_results.length > 0,
      resultId: session.assessment_results?.[0]?.id || null,
    }));

    return NextResponse.json({ assessments });
  } catch (error) {
    console.error("Exception fetching assessments:", error);
    return NextResponse.json({ assessments: [] });
  }
}

