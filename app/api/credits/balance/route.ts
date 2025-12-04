import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { supabase } from "@/lib/supabase";

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
      // Return zero balance if user not found (new user)
      return NextResponse.json({
        balance: 0,
        lifetimeEarned: 0,
        lifetimeSpent: 0,
        transactions: [],
      });
    }

    // Get or create credit balance
    let { data: credits, error: creditsError } = await supabase
      .from("user_credits")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (creditsError || !credits) {
      // Create credit record for user
      const { data: newCredits } = await supabase
        .from("user_credits")
        .insert({ user_id: user.id, balance: 0, lifetime_earned: 0, lifetime_spent: 0 })
        .select()
        .single();
      credits = newCredits;
    }

    // Get recent transactions
    const { data: transactions } = await supabase
      .from("credit_transactions")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(20);

    return NextResponse.json({
      balance: Number(credits?.balance) || 0,
      lifetimeEarned: Number(credits?.lifetime_earned) || 0,
      lifetimeSpent: Number(credits?.lifetime_spent) || 0,
      transactions: (transactions || []).map((t) => ({
        id: t.id,
        amount: Number(t.amount),
        type: t.type,
        description: t.description,
        createdAt: t.created_at,
      })),
    });
  } catch (error) {
    console.error("Error fetching credit balance:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}


