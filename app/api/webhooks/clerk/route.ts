import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    console.error("WEBHOOK_SECRET is missing from environment variables");
    return new Response(
      JSON.stringify({ error: "Webhook secret not configured" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    // Get the headers
    const headerPayload = await headers();
    const svix_id = headerPayload.get("svix-id");
    const svix_timestamp = headerPayload.get("svix-timestamp");
    const svix_signature = headerPayload.get("svix-signature");

    // If there are no headers, error out
    if (!svix_id || !svix_timestamp || !svix_signature) {
      console.error("Missing svix headers:", { 
        svix_id: !!svix_id, 
        svix_timestamp: !!svix_timestamp, 
        svix_signature: !!svix_signature 
      });
      return new Response(
        JSON.stringify({ error: "Missing svix headers" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Get the body as text first (needed for verification)
    // IMPORTANT: Can only read body once!
    const body = await req.text();
    
    if (!body) {
      console.error("Empty request body");
      return new Response(
        JSON.stringify({ error: "Empty request body" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Create a new Svix instance with your secret.
    const wh = new Webhook(WEBHOOK_SECRET);

    let evt: WebhookEvent;

    // Verify the payload with the headers
    try {
      evt = wh.verify(body, {
        "svix-id": svix_id,
        "svix-timestamp": svix_timestamp,
        "svix-signature": svix_signature,
      }) as WebhookEvent;
    } catch (err) {
      console.error("Error verifying webhook:", err);
      return new Response(
        JSON.stringify({ 
          error: "Webhook verification failed", 
          details: err instanceof Error ? err.message : String(err) 
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Handle the webhook
    const eventType = evt.type;
    console.log(`✅ Webhook received: ${eventType}`, { userId: evt.data?.id });

    // Check Supabase configuration
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl) {
      console.error("Supabase URL not configured");
      return new Response(
        JSON.stringify({ error: "Supabase not configured" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    // Use service_role key if available (bypasses RLS), otherwise use anon key
    // Service role key is required for webhook inserts due to RLS
    const supabaseKey = supabaseServiceKey || supabaseAnonKey;
    
    if (!supabaseKey) {
      console.error("Supabase key not configured");
      return new Response(
        JSON.stringify({ error: "Supabase key not configured" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    // Create Supabase client with service_role key (bypasses RLS)
    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    if (eventType === "user.created") {
      const { id, email_addresses } = evt.data;
      const email = email_addresses[0]?.email_address || null;

      console.log(`📝 Attempting to insert user:`, { 
        clerk_id: id, 
        email: email,
        supabaseUrl: supabaseUrl,
        hasServiceKey: !!supabaseServiceKey 
      });

      // Sync user to Supabase
      const { data: insertedData, error } = await supabase
        .from("users")
        .insert({
          clerk_id: id,
          email: email,
        })
        .select();

      if (error) {
        console.error("❌ Error syncing user to Supabase:", {
          error: error,
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint,
        });
        return new Response(
          JSON.stringify({ 
            error: "Failed to sync user", 
            details: error.message,
            code: error.code,
            hint: error.hint,
          }),
          { status: 500, headers: { "Content-Type": "application/json" } }
        );
      }

      console.log(`✅ User ${id} synced to Supabase successfully:`, insertedData);
    }

    if (eventType === "user.updated") {
      const { id, email_addresses } = evt.data;

      const { error } = await supabase
        .from("users")
        .update({
          email: email_addresses[0]?.email_address || null,
          updated_at: new Date().toISOString(),
        })
        .eq("clerk_id", id);

      if (error) {
        console.error("Error updating user in Supabase:", error);
        return new Response(
          JSON.stringify({ 
            error: "Failed to update user", 
            details: error.message 
          }),
          { status: 500, headers: { "Content-Type": "application/json" } }
        );
      }

      console.log(`✅ User ${id} updated in Supabase successfully`);
    }

    if (eventType === "user.deleted") {
      const { id } = evt.data;

      const { error } = await supabase
        .from("users")
        .delete()
        .eq("clerk_id", id);

      if (error) {
        console.error("Error deleting user from Supabase:", error);
        return new Response(
          JSON.stringify({ 
            error: "Failed to delete user", 
            details: error.message 
          }),
          { status: 500, headers: { "Content-Type": "application/json" } }
        );
      }

      console.log(`✅ User ${id} deleted from Supabase successfully`);
    }

    return new Response(
      JSON.stringify({ success: true, event: eventType }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Unexpected error in webhook handler:", error);
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        details: error instanceof Error ? error.message : String(error),
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
