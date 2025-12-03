import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, guestSessionId, referralCode } = body;

    // Check if Supabase is configured - use service role to bypass RLS
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      // Supabase not configured - return success with mock session
      console.warn("Supabase not configured, creating in-memory session");
      return NextResponse.json({
        session: {
          id: guestSessionId || crypto.randomUUID(),
          user_id: userId || null,
          guest_session_id: guestSessionId || null,
          progress: 0,
          started_at: new Date().toISOString(),
        },
      });
    }

    // Create supabase client with service role to bypass RLS
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    // Create assessment session in database
    const { data: session, error } = await supabase
      .from("assessment_sessions")
      .insert({
        id: guestSessionId || undefined, // Use provided UUID if available
        user_id: userId || null,
        guest_session_id: guestSessionId || null,
        referral_code: referralCode || null,
        progress: 0,
        started_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating session:", error);
      // Return success anyway with mock session - don't block user
      return NextResponse.json({
        session: {
          id: guestSessionId || crypto.randomUUID(),
          user_id: userId || null,
          guest_session_id: guestSessionId || null,
          progress: 0,
          started_at: new Date().toISOString(),
        },
      });
    }

    return NextResponse.json({ session });
  } catch (error) {
    console.error("Exception creating session:", error);
    // Return success with mock session - don't block user
    // Note: body already parsed above, so we can't parse again
    // Generate a new session ID if we don't have one
    return NextResponse.json({
      session: {
        id: crypto.randomUUID(),
        user_id: null,
        guest_session_id: null,
        progress: 0,
        started_at: new Date().toISOString(),
      },
    });
  }
}

