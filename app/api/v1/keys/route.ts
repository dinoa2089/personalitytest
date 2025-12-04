import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";
import {
  generateApiKey,
  listApiKeys,
  revokeApiKey,
  deleteApiKey,
  getUsageStats,
  ApiTier,
} from "@/lib/api-auth";

// This route uses Clerk auth (not API key auth) for managing keys
// Protected by checking Clerk session

async function getUserId(): Promise<string | null> {
  const { userId: clerkId } = await auth();
  if (!clerkId) return null;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) return null;

  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { data } = await supabase
    .from("users")
    .select("id")
    .eq("clerk_id", clerkId)
    .single();

  return data?.id || null;
}

// GET - List API keys
export async function GET() {
  try {
    const userId = await getUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const keys = await listApiKeys(userId);
    const stats = await getUsageStats(userId);

    return NextResponse.json({ keys, stats });
  } catch (error) {
    console.error("Error listing API keys:", error);
    return NextResponse.json({ error: "Failed to list API keys" }, { status: 500 });
  }
}

// POST - Create new API key
export async function POST(request: NextRequest) {
  try {
    const userId = await getUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const tier = (body.tier as ApiTier) || "api_starter";

    // Validate tier
    if (!["api_starter", "professional", "enterprise"].includes(tier)) {
      return NextResponse.json({ error: "Invalid tier" }, { status: 400 });
    }

    const result = await generateApiKey(userId, tier);

    return NextResponse.json({
      success: true,
      apiKey: result.apiKey, // Only returned once!
      keyPrefix: result.keyPrefix,
      keyId: result.keyId,
      message: "Store this API key securely - it will only be shown once!",
    });
  } catch (error) {
    console.error("Error creating API key:", error);
    return NextResponse.json({ error: "Failed to create API key" }, { status: 500 });
  }
}

// DELETE - Revoke or delete API key
export async function DELETE(request: NextRequest) {
  try {
    const userId = await getUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const keyId = searchParams.get("keyId");
    const permanent = searchParams.get("permanent") === "true";

    if (!keyId) {
      return NextResponse.json({ error: "Missing keyId" }, { status: 400 });
    }

    if (permanent) {
      await deleteApiKey(keyId, userId);
      return NextResponse.json({ success: true, message: "API key deleted" });
    } else {
      await revokeApiKey(keyId, userId);
      return NextResponse.json({ success: true, message: "API key revoked" });
    }
  } catch (error) {
    console.error("Error deleting API key:", error);
    return NextResponse.json({ error: "Failed to delete API key" }, { status: 500 });
  }
}

