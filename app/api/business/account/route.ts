import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { supabase } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const userIdParam = searchParams.get("user_id") || userId;

    // Get user's internal ID
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("id")
      .eq("clerk_id", userIdParam)
      .single();

    if (userError || !user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Get business account
    const { data: businessAccount, error: businessError } = await supabase
      .from("business_accounts")
      .select("*")
      .or(`admin_user_id.eq.${user.id},id.in.(SELECT business_id FROM business_team_members WHERE user_id.eq.${user.id})`)
      .single();

    if (businessError || !businessAccount) {
      return NextResponse.json({
        business_account: null,
      });
    }

    return NextResponse.json({ business_account: businessAccount });
  } catch (error) {
    console.error("Error fetching business account:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { company_name, subscription_tier } = body;

    if (!company_name) {
      return NextResponse.json(
        { error: "Company name is required" },
        { status: 400 }
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

    // Create business account
    const { data: businessAccount, error: businessError } = await supabase
      .from("business_accounts")
      .insert({
        company_name: company_name,
        admin_user_id: user.id,
        subscription_tier: subscription_tier || "starter",
      })
      .select()
      .single();

    if (businessError) {
      console.error("Error creating business account:", businessError);
      return NextResponse.json(
        { error: "Failed to create business account" },
        { status: 500 }
      );
    }

    return NextResponse.json({ business_account: businessAccount });
  } catch (error) {
    console.error("Error creating business account:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

