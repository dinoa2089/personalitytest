import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    const { amount, purchaseId } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: "Invalid amount" },
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
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get current balance
    const { data: credits, error: creditsError } = await supabase
      .from("user_credits")
      .select("balance")
      .eq("user_id", user.id)
      .single();

    if (creditsError || !credits) {
      return NextResponse.json(
        { error: "No credits available" },
        { status: 400 }
      );
    }

    const currentBalance = Number(credits.balance) || 0;

    if (amount > currentBalance) {
      return NextResponse.json(
        { error: "Insufficient credits", availableBalance: currentBalance },
        { status: 400 }
      );
    }

    // Deduct credits
    const { error: updateError } = await supabase
      .from("user_credits")
      .update({
        balance: currentBalance - amount,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", user.id);

    if (updateError) {
      console.error("Error updating credits:", updateError);
      return NextResponse.json(
        { error: "Failed to apply credits" },
        { status: 500 }
      );
    }

    // Log the credit transaction
    try {
      await supabase.rpc("add_user_credit", {
        p_user_id: user.id,
        p_amount: -amount,
        p_type: "purchase_applied",
        p_description: purchaseId ? `Applied to purchase ${purchaseId}` : "Applied to purchase",
        p_reference_id: purchaseId || null,
      });
    } catch {
      // If RPC fails, log transaction manually
      await supabase.from("credit_transactions").insert({
        user_id: user.id,
        amount: -amount,
        type: "purchase_applied",
        description: purchaseId ? `Applied to purchase ${purchaseId}` : "Applied to purchase",
        reference_id: purchaseId || null,
      });
    }

    // Get updated balance
    const { data: updatedCredits } = await supabase
      .from("user_credits")
      .select("balance")
      .eq("user_id", user.id)
      .single();

    return NextResponse.json({
      success: true,
      amountApplied: amount,
      newBalance: Number(updatedCredits?.balance) || currentBalance - amount,
    });
  } catch (error) {
    console.error("Error applying credits:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

