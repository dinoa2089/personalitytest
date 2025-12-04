import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { isMasterAdmin } from "@/lib/admin";

/**
 * POST /api/admin/claim-session
 * Admin-only endpoint to manually link a session to a user
 */
export async function POST(request: NextRequest) {
  try {
    const { sessionId, userEmail } = await request.json();

    if (!sessionId || !userEmail) {
      return NextResponse.json(
        { error: "sessionId and userEmail are required" },
        { status: 400 }
      );
    }

    // Only master admins can use this endpoint
    if (!isMasterAdmin(userEmail)) {
      return NextResponse.json(
        { error: "Unauthorized - admin access required" },
        { status: 403 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json(
        { error: "Database not configured" },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    // Find the user by email
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("id, clerk_id")
      .eq("email", userEmail)
      .single();

    if (userError || !user) {
      return NextResponse.json(
        { error: "User not found in database", details: userError?.message },
        { status: 404 }
      );
    }

    // Check if session exists
    const { data: session, error: sessionError } = await supabase
      .from("assessment_sessions")
      .select("id, user_id")
      .eq("id", sessionId)
      .single();

    if (sessionError || !session) {
      return NextResponse.json(
        { error: "Session not found", details: sessionError?.message },
        { status: 404 }
      );
    }

    // Update session to link to user
    const { error: updateError } = await supabase
      .from("assessment_sessions")
      .update({ user_id: user.id })
      .eq("id", sessionId);

    if (updateError) {
      return NextResponse.json(
        { error: "Failed to update session", details: updateError.message },
        { status: 500 }
      );
    }

    // Also update assessment_results if they exist
    await supabase
      .from("assessment_results")
      .update({ user_id: user.id })
      .eq("session_id", sessionId);

    return NextResponse.json({
      success: true,
      message: `Session ${sessionId} linked to user ${userEmail}`,
      userId: user.id,
    });
  } catch (error) {
    console.error("Error in admin claim-session:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

