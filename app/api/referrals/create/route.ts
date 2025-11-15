import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { supabase } from "@/lib/supabase";
import { getAppUrl } from "@/lib/app-url";

export async function POST(request: NextRequest) {
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

    // Check if user already has a referral code
    const { data: existingCode } = await supabase
      .from("referral_codes")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (existingCode) {
      return NextResponse.json({
        code: existingCode.code,
        referralLink: `${getAppUrl()}/assessment/intro?ref=${existingCode.code}`,
      });
    }

    // Generate unique referral code
    const code = generateReferralCode();
    
    // Create referral code
    const { data: referralCode, error: codeError } = await supabase
      .from("referral_codes")
      .insert({
        user_id: user.id,
        code: code,
      })
      .select()
      .single();

    if (codeError) {
      console.error("Error creating referral code:", codeError);
      return NextResponse.json(
        { error: "Failed to create referral code" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      code: referralCode.code,
      referralLink: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/assessment/intro?ref=${referralCode.code}`,
    });
  } catch (error) {
    console.error("Error in referral creation:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

function generateReferralCode(): string {
  // Generate a random 8-character alphanumeric code
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // Exclude confusing chars
  let code = "";
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

