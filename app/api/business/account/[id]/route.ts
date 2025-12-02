import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { supabase } from "@/lib/supabase";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { company_name, subscription_tier } = body;

    const updates: any = {};
    if (company_name !== undefined) updates.company_name = company_name;
    if (subscription_tier !== undefined) updates.subscription_tier = subscription_tier;
    updates.updated_at = new Date().toISOString();

    const { data: businessAccount, error } = await supabase
      .from("business_accounts")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating business account:", error);
      return NextResponse.json(
        { error: "Failed to update business account" },
        { status: 500 }
      );
    }

    return NextResponse.json({ business_account: businessAccount });
  } catch (error) {
    console.error("Error updating business account:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}


