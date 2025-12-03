import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { supabase } from "@/lib/supabase";
import { getAppUrl } from "@/lib/app-url";

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user's internal ID
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("id")
      .eq("clerk_id", userId)
      .single();

    if (userError || !user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get existing referral code
    let { data: referralCode, error: codeError } = await supabase
      .from("referral_codes")
      .select("code")
      .eq("user_id", user.id)
      .single();

    // If no code exists, create one
    if (codeError || !referralCode) {
      const code = generateReferralCode();
      const { data: newCode, error: createError } = await supabase
        .from("referral_codes")
        .insert({
          user_id: user.id,
          code: code,
        })
        .select("code")
        .single();

      if (createError) {
        console.error("Error creating referral code:", createError);
        return NextResponse.json(
          { error: "Failed to create referral code" },
          { status: 500 }
        );
      }

      referralCode = newCode;
    }

    const baseUrl = getAppUrl();

    return NextResponse.json({
      code: referralCode.code,
      link: `${baseUrl}/assessment/intro?ref=${referralCode.code}`,
    });
  } catch (error) {
    console.error("Error getting referral code:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

function generateReferralCode(): string {
  // Generate a random 8-character alphanumeric code
  // Exclude confusing characters like 0, O, I, L, 1
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

