import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { supabase } from "@/lib/supabase";
import { getAppUrl } from "@/lib/app-url";

const REFERRAL_UNLOCK_THRESHOLD = 3; // Number of completions needed to unlock premium

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        { error: "Database not configured" },
        { status: 500 }
      );
    }

    // Get user's internal ID
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("id")
      .eq("clerk_id", userId)
      .single();

    if (userError || !user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Get referral code
    const { data: referralCode } = await supabase
      .from("referral_codes")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (!referralCode) {
      return NextResponse.json({
        hasCode: false,
        completedReferrals: 0,
        threshold: REFERRAL_UNLOCK_THRESHOLD,
        progress: 0,
        unlocked: false,
      });
    }

    // Count completed referrals
    const { data: referrals, error: referralsError } = await supabase
      .from("referrals")
      .select("*")
      .eq("referral_code", referralCode.code);

    const completedCount = referrals?.filter(r => r.completed_at !== null).length || 0;
    const unlocked = completedCount >= REFERRAL_UNLOCK_THRESHOLD;

    // Check if premium unlock exists
    const { data: unlock } = await supabase
      .from("premium_unlocks")
      .select("*")
      .eq("user_id", user.id)
      .eq("unlock_method", "referral")
      .or("expires_at.is.null,expires_at.gt." + new Date().toISOString())
      .single();

    return NextResponse.json({
      hasCode: true,
      code: referralCode.code,
      referralLink: `${getAppUrl()}/assessment/intro?ref=${referralCode.code}`,
      completedReferrals: completedCount,
      threshold: REFERRAL_UNLOCK_THRESHOLD,
      progress: Math.min((completedCount / REFERRAL_UNLOCK_THRESHOLD) * 100, 100),
      unlocked: unlocked || !!unlock,
      referrals: referrals?.map(r => ({
        id: r.id,
        completedAt: r.completed_at,
        unlockedPremium: r.unlocked_premium,
      })) || [],
    });
  } catch (error) {
    console.error("Error fetching referral stats:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

