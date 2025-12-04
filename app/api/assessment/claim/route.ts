import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { auth, currentUser } from "@clerk/nextjs/server";

/**
 * POST /api/assessment/claim
 * Links a guest assessment session to an authenticated user's account.
 * This is called when a user signs in after completing an assessment.
 */
export async function POST(request: NextRequest) {
  try {
    const { sessionId } = await request.json();

    if (!sessionId) {
      return NextResponse.json(
        { error: "Session ID is required" },
        { status: 400 }
      );
    }

    // Get the authenticated user from Clerk
    const { userId: clerkId } = await auth();
    const user = await currentUser();

    if (!clerkId || !user) {
      return NextResponse.json(
        { error: "User must be authenticated to claim a session" },
        { status: 401 }
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

    // First, find or create the user in our database
    let { data: dbUser } = await supabase
      .from("users")
      .select("id")
      .eq("clerk_id", clerkId)
      .single();

    if (!dbUser) {
      // Create user if they don't exist
      const email = user.primaryEmailAddress?.emailAddress || "";
      const { data: newUser, error: createError } = await supabase
        .from("users")
        .insert({
          clerk_id: clerkId,
          email: email,
        })
        .select("id")
        .single();

      if (createError) {
        console.error("Error creating user:", createError);
        return NextResponse.json(
          { error: "Failed to create user record" },
          { status: 500 }
        );
      }
      dbUser = newUser;
    }

    // Check if the session exists and is unclaimed
    const { data: session, error: sessionError } = await supabase
      .from("assessment_sessions")
      .select("id, user_id, guest_session_id")
      .eq("id", sessionId)
      .single();

    if (sessionError || !session) {
      console.error("Session not found:", sessionError);
      return NextResponse.json(
        { error: "Session not found" },
        { status: 404 }
      );
    }

    // Check if session is already claimed by a different user
    if (session.user_id && session.user_id !== dbUser.id) {
      return NextResponse.json(
        { error: "Session already belongs to another user" },
        { status: 403 }
      );
    }

    // If session already belongs to this user, just return success
    if (session.user_id === dbUser.id) {
      return NextResponse.json({ 
        success: true, 
        message: "Session already linked to your account",
        alreadyClaimed: true 
      });
    }

    // Update the session to link it to the user
    const { error: updateSessionError } = await supabase
      .from("assessment_sessions")
      .update({ user_id: dbUser.id })
      .eq("id", sessionId);

    if (updateSessionError) {
      console.error("Error updating session:", updateSessionError);
      return NextResponse.json(
        { error: "Failed to link session to account" },
        { status: 500 }
      );
    }

    // Also update the assessment_results if they exist
    const { error: updateResultsError } = await supabase
      .from("assessment_results")
      .update({ user_id: dbUser.id })
      .eq("session_id", sessionId)
      .is("user_id", null);

    if (updateResultsError) {
      console.error("Error updating results (non-critical):", updateResultsError);
      // Don't fail the request - session is already linked
    }

    console.log(`Session ${sessionId} claimed by user ${dbUser.id} (Clerk: ${clerkId})`);

    return NextResponse.json({ 
      success: true, 
      message: "Session successfully linked to your account",
      userId: dbUser.id
    });

  } catch (error) {
    console.error("Error claiming session:", error);
    return NextResponse.json(
      { error: "Failed to claim session" },
      { status: 500 }
    );
  }
}

