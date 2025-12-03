import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

export interface PurchaseStatus {
  compatibility: boolean;
  career: boolean;
  frameworks: boolean;
  growth_plan: boolean;
  full_unlock: boolean;
}

const defaultStatus: PurchaseStatus = {
  compatibility: false,
  career: false,
  frameworks: false,
  growth_plan: false,
  full_unlock: false,
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");
  const sessionId = searchParams.get("sessionId");

  if (!userId) {
    return NextResponse.json({ error: "userId required" }, { status: 400 });
  }

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error("Supabase not configured");
    return NextResponse.json(defaultStatus);
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  try {
    // Get user's internal ID
    const { data: user } = await supabase
      .from("users")
      .select("id")
      .eq("clerk_id", userId)
      .single();

    if (!user) {
      return NextResponse.json(defaultStatus);
    }

    // First check if user has legacy premium subscription (gives full access)
    const { data: subscription } = await supabase
      .from("subscriptions")
      .select("id, plan, status")
      .eq("user_id", user.id)
      .eq("status", "active")
      .single();

    if (subscription) {
      // Premium subscription = full access
      return NextResponse.json({
        compatibility: true,
        career: true,
        frameworks: true,
        growth_plan: true,
        full_unlock: true,
        _source: "subscription",
      });
    }

    // Check for full_unlock first (unlocks everything)
    const sessionFilter = sessionId
      ? `session_id.eq.${sessionId},session_id.is.null`
      : "session_id.is.null";

    const { data: fullUnlock } = await supabase
      .from("purchases")
      .select("id")
      .eq("user_id", user.id)
      .eq("product_type", "full_unlock")
      .or(sessionFilter)
      .eq("status", "completed")
      .limit(1);

    if (fullUnlock && fullUnlock.length > 0) {
      return NextResponse.json({
        compatibility: true,
        career: true,
        frameworks: true,
        growth_plan: true,
        full_unlock: true,
        _source: "full_unlock_purchase",
      });
    }

    // Check individual purchases
    const { data: purchases } = await supabase
      .from("purchases")
      .select("product_type")
      .eq("user_id", user.id)
      .or(sessionFilter)
      .eq("status", "completed");

    const purchasedTypes = new Set(purchases?.map((p) => p.product_type) || []);

    return NextResponse.json({
      compatibility: purchasedTypes.has("compatibility"),
      career: purchasedTypes.has("career"),
      frameworks: purchasedTypes.has("frameworks"),
      growth_plan: purchasedTypes.has("growth_plan"),
      full_unlock: false,
      _source: "individual_purchases",
    });
  } catch (error) {
    console.error("Error checking purchases:", error);
    return NextResponse.json(defaultStatus);
  }
}

