/**
 * Debug endpoint to test webhook without verification
 * Remove this after debugging!
 */
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("DEBUG: Received webhook payload:", JSON.stringify(body, null, 2));

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json(
        { error: "Supabase not configured", supabaseUrl: !!supabaseUrl, serviceKey: !!supabaseServiceKey },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    if (body.type === "user.created") {
      const { id, email_addresses } = body.data;
      console.log("DEBUG: Attempting to insert user:", { clerk_id: id, email: email_addresses[0]?.email_address });

      const { data, error } = await supabase.from("users").insert({
        clerk_id: id,
        email: email_addresses[0]?.email_address || null,
      }).select();

      if (error) {
        console.error("DEBUG: Supabase error:", error);
        return NextResponse.json({ error: "Supabase insert failed", details: error }, { status: 500 });
      }

      console.log("DEBUG: User inserted successfully:", data);
      return NextResponse.json({ success: true, user: data });
    }

    return NextResponse.json({ success: true, event: body.type });
  } catch (error) {
    console.error("DEBUG: Exception:", error);
    return NextResponse.json(
      { error: "Exception", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

