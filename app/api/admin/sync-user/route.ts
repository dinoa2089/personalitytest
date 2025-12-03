import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { currentUser } from "@clerk/nextjs/server";

/**
 * Manually sync the current logged-in Clerk user to Supabase
 * This is for users who were created before the webhook was set up
 * 
 * POST /api/admin/sync-user
 */
export async function POST(request: NextRequest) {
  try {
    // Get the current logged-in user from Clerk
    const user = await currentUser();
    
    if (!user) {
      return NextResponse.json(
        { error: "Not authenticated. Please log in first." },
        { status: 401 }
      );
    }

    const clerkId = user.id;
    const email = user.emailAddresses[0]?.emailAddress || null;

    console.log("Syncing user:", { clerkId, email });

    // Check Supabase configuration
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl) {
      return NextResponse.json(
        { error: "Supabase not configured" },
        { status: 500 }
      );
    }

    const supabaseKey = supabaseServiceKey || supabaseAnonKey;
    if (!supabaseKey) {
      return NextResponse.json(
        { error: "Supabase key not configured" },
        { status: 500 }
      );
    }

    // Create Supabase client
    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // Check if user already exists
    const { data: existingUser, error: selectError } = await supabase
      .from("users")
      .select("id, clerk_id, email")
      .eq("clerk_id", clerkId)
      .single();

    if (existingUser) {
      // User exists - update email if needed
      if (existingUser.email !== email) {
        const { error: updateError } = await supabase
          .from("users")
          .update({ email, updated_at: new Date().toISOString() })
          .eq("clerk_id", clerkId);

        if (updateError) {
          return NextResponse.json(
            { error: "Failed to update user", details: updateError.message },
            { status: 500 }
          );
        }

        return NextResponse.json({
          success: true,
          action: "updated",
          user: { clerk_id: clerkId, email },
          message: "User email updated in Supabase",
        });
      }

      return NextResponse.json({
        success: true,
        action: "already_synced",
        user: existingUser,
        message: "User already exists in Supabase",
      });
    }

    // User doesn't exist - create new user
    const { data: newUser, error: insertError } = await supabase
      .from("users")
      .insert({
        clerk_id: clerkId,
        email: email,
      })
      .select()
      .single();

    if (insertError) {
      console.error("Error creating user:", insertError);
      return NextResponse.json(
        { error: "Failed to create user", details: insertError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      action: "created",
      user: newUser,
      message: "User synced to Supabase successfully!",
    });
  } catch (error) {
    console.error("Error syncing user:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

