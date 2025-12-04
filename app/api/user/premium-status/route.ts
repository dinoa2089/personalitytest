import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { isMasterAdmin } from "@/lib/admin";

/**
 * GET /api/user/premium-status
 * Check if the current user has premium access
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const userEmail = searchParams.get("email");

    if (!userId) {
      return NextResponse.json({ hasPremium: false, reason: "No user ID" });
    }

    // First check if master admin by email
    if (userEmail && isMasterAdmin(userEmail)) {
      return NextResponse.json({ 
        hasPremium: true, 
        reason: "admin",
        isAdmin: true 
      });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      // If no Supabase, check admin status only
      return NextResponse.json({ 
        hasPremium: userEmail ? isMasterAdmin(userEmail) : false,
        reason: userEmail && isMasterAdmin(userEmail) ? "admin" : "no_database"
      });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    // Get user's internal ID from Clerk ID
    const { data: user } = await supabase
      .from("users")
      .select("id, email")
      .eq("clerk_id", userId)
      .single();

    if (!user) {
      // User might not be synced yet - check by email only
      return NextResponse.json({ 
        hasPremium: userEmail ? isMasterAdmin(userEmail) : false,
        reason: userEmail && isMasterAdmin(userEmail) ? "admin" : "user_not_found"
      });
    }

    // Check if master admin by email from database
    if (user.email && isMasterAdmin(user.email)) {
      return NextResponse.json({ 
        hasPremium: true, 
        reason: "admin",
        isAdmin: true 
      });
    }

    // Check for active subscription
    const { data: subscription } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", user.id)
      .eq("status", "active")
      .in("plan", ["premium_report", "deep_dive", "unlimited", "team", "enterprise", "premium", "professional"])
      .single();

    if (subscription) {
      return NextResponse.json({ 
        hasPremium: true, 
        reason: "subscription",
        plan: subscription.plan 
      });
    }

    // Check for premium unlock (referral, trial, etc.)
    const { data: unlock } = await supabase
      .from("premium_unlocks")
      .select("*")
      .eq("user_id", user.id)
      .or("expires_at.is.null,expires_at.gt." + new Date().toISOString())
      .order("unlocked_at", { ascending: false })
      .limit(1)
      .single();

    if (unlock) {
      return NextResponse.json({ 
        hasPremium: true, 
        reason: "unlock",
        unlockMethod: unlock.unlock_method 
      });
    }

    return NextResponse.json({ hasPremium: false, reason: "no_premium" });
  } catch (error) {
    console.error("Error checking premium status:", error);
    return NextResponse.json({ 
      hasPremium: false, 
      reason: "error",
      error: String(error)
    });
  }
}

