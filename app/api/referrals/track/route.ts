import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

const REFERRAL_UNLOCK_THRESHOLD = 3;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { referralCode, sessionId } = body;

    if (!referralCode || !sessionId) {
      return NextResponse.json(
        { error: "Missing referral code or session ID" },
        { status: 400 }
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

    // Find referral code owner
    const { data: codeData, error: codeError } = await supabase
      .from("referral_codes")
      .select("user_id, code")
      .eq("code", referralCode)
      .single();

    if (codeError || !codeData) {
      return NextResponse.json(
        { error: "Invalid referral code" },
        { status: 404 }
      );
    }

    // Check if referral already exists for this session
    const { data: existingReferral } = await supabase
      .from("referrals")
      .select("*")
      .eq("referee_session_id", sessionId)
      .eq("referral_code", referralCode)
      .single();

    if (existingReferral) {
      return NextResponse.json({ success: true, alreadyTracked: true });
    }

    // Create referral record
    const { data: referral, error: referralError } = await supabase
      .from("referrals")
      .insert({
        referrer_user_id: codeData.user_id,
        referee_session_id: sessionId,
        referral_code: referralCode,
        completed_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (referralError) {
      console.error("Error creating referral:", referralError);
      return NextResponse.json(
        { error: "Failed to track referral" },
        { status: 500 }
      );
    }

    // Update referral code usage count
    const { data: currentCode } = await supabase
      .from("referral_codes")
      .select("uses")
      .eq("id", codeData.id)
      .single();
    
    await supabase
      .from("referral_codes")
      .update({ uses: (currentCode?.uses || 0) + 1 })
      .eq("id", codeData.id);

    // Check if threshold is met
    const { data: allReferrals } = await supabase
      .from("referrals")
      .select("*")
      .eq("referral_code", referralCode)
      .not("completed_at", "is", null);

    const completedCount = allReferrals?.length || 0;

    if (completedCount >= REFERRAL_UNLOCK_THRESHOLD) {
      // Check if unlock already exists
      const { data: existingUnlock } = await supabase
        .from("premium_unlocks")
        .select("*")
        .eq("user_id", codeData.user_id)
        .eq("unlock_method", "referral")
        .or("expires_at.is.null,expires_at.gt." + new Date().toISOString())
        .single();

      if (!existingUnlock) {
        // Create premium unlock
        await supabase
          .from("premium_unlocks")
          .insert({
            user_id: codeData.user_id,
            unlock_method: "referral",
            unlock_source: referralCode,
            expires_at: null, // Permanent unlock
          });

        // Mark referrals as having unlocked premium
        await supabase
          .from("referrals")
          .update({ unlocked_premium: true })
          .eq("referral_code", referralCode);

        // Update unlock count
        const { data: codeForUnlock } = await supabase
          .from("referral_codes")
          .select("unlocks_earned")
          .eq("id", codeData.id)
          .single();
        
        await supabase
          .from("referral_codes")
          .update({ unlocks_earned: (codeForUnlock?.unlocks_earned || 0) + 1 })
          .eq("id", codeData.id);
      }
    }

    return NextResponse.json({ success: true, completedCount });
  } catch (error) {
    console.error("Error tracking referral:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

