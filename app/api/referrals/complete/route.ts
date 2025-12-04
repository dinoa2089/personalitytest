import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

const CREDIT_AMOUNT = 1.50;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { referralCode, sessionId, referredUserId } = body;

    if (!referralCode) {
      return NextResponse.json(
        { error: "No referral code provided" },
        { status: 400 }
      );
    }

    // Find the referral code owner
    const { data: codeData, error: codeError } = await supabase
      .from("referral_codes")
      .select("id, user_id, code")
      .eq("code", referralCode.toUpperCase())
      .single();

    if (codeError || !codeData) {
      return NextResponse.json(
        { error: "Invalid referral code" },
        { status: 404 }
      );
    }

    // Check if referral already exists for this session (prevent double credits)
    if (sessionId) {
      const { data: existingReferral } = await supabase
        .from("referrals")
        .select("id, credited_at")
        .eq("referee_session_id", sessionId)
        .eq("referral_code", referralCode.toUpperCase())
        .single();

      if (existingReferral) {
        // Already tracked
        if (existingReferral.credited_at) {
          return NextResponse.json({
            success: true,
            alreadyCredited: true,
            message: "Referral already credited",
          });
        }
        
        // Referral exists but not credited yet - credit now
        return await creditReferrer(codeData.user_id, existingReferral.id, sessionId);
      }
    }

    // Create referral record
    const { data: newReferral, error: referralError } = await supabase
      .from("referrals")
      .insert({
        referrer_user_id: codeData.user_id,
        referee_session_id: sessionId,
        referral_code: referralCode.toUpperCase(),
        completed_at: new Date().toISOString(),
        credit_amount: CREDIT_AMOUNT,
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
    await supabase
      .from("referral_codes")
      .update({ 
        uses: (await supabase
          .from("referral_codes")
          .select("uses")
          .eq("id", codeData.id)
          .single()
          .then(r => r.data?.uses || 0)) + 1 
      })
      .eq("id", codeData.id);

    // Credit the referrer
    return await creditReferrer(codeData.user_id, newReferral.id, sessionId);
  } catch (error) {
    console.error("Error completing referral:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

async function creditReferrer(
  referrerUserId: string,
  referralId: string,
  sessionId?: string
): Promise<NextResponse> {
  try {
    // Get or create user credits
    const { data: existingCredits } = await supabase
      .from("user_credits")
      .select("*")
      .eq("user_id", referrerUserId)
      .single();

    if (existingCredits) {
      // Update existing balance
      await supabase
        .from("user_credits")
        .update({
          balance: Number(existingCredits.balance) + CREDIT_AMOUNT,
          lifetime_earned: Number(existingCredits.lifetime_earned) + CREDIT_AMOUNT,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", referrerUserId);
    } else {
      // Create new credit record
      await supabase.from("user_credits").insert({
        user_id: referrerUserId,
        balance: CREDIT_AMOUNT,
        lifetime_earned: CREDIT_AMOUNT,
        lifetime_spent: 0,
      });
    }

    // Log the credit transaction
    await supabase.from("credit_transactions").insert({
      user_id: referrerUserId,
      amount: CREDIT_AMOUNT,
      type: "referral_bonus",
      description: "Friend completed assessment",
      reference_id: sessionId || referralId,
    });

    // Mark referral as credited
    await supabase
      .from("referrals")
      .update({ credited_at: new Date().toISOString() })
      .eq("id", referralId);

    return NextResponse.json({
      success: true,
      creditAmount: CREDIT_AMOUNT,
      message: `Referrer credited $${CREDIT_AMOUNT.toFixed(2)}`,
    });
  } catch (error) {
    console.error("Error crediting referrer:", error);
    return NextResponse.json(
      { error: "Failed to credit referrer" },
      { status: 500 }
    );
  }
}


