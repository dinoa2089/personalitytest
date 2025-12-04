import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";

/**
 * Check environment configuration
 * GET /api/admin/check-config
 */
export async function GET(request: NextRequest) {
  try {
    const user = await currentUser();
    
    const config = {
      clerk: {
        authenticated: !!user,
        userId: user?.id || null,
        email: user?.emailAddresses[0]?.emailAddress || null,
      },
      supabase: {
        url: process.env.NEXT_PUBLIC_SUPABASE_URL ? "✅ Set" : "❌ Missing",
        urlValue: process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 30) + "..." || null,
        anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "✅ Set" : "❌ Missing",
        serviceKey: process.env.SUPABASE_SERVICE_ROLE_KEY ? "✅ Set" : "❌ Missing",
      },
      webhook: {
        secret: process.env.WEBHOOK_SECRET ? "✅ Set" : "❌ Missing",
      },
    };

    return NextResponse.json(config);
  } catch (error) {
    return NextResponse.json({ 
      error: "Error checking config",
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}


