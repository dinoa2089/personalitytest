import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { calculateArchetype, archetypes } from "@/lib/archetypes";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId } = await params;

    // Fetch the assessment result
    const { data: result, error } = await supabase
      .from("assessment_results")
      .select("dimensional_scores, user_id")
      .eq("session_id", sessionId)
      .single();

    if (error || !result) {
      return NextResponse.json(
        { error: "Assessment not found" },
        { status: 404 }
      );
    }

    // Calculate archetype from scores
    const scores = Object.entries(result.dimensional_scores || {}).map(([dimension, data]: [string, any]) => ({
      dimension: dimension as any,
      raw_score: data.score || data.raw_score || 0,
      percentile: data.percentile || 50,
      confidence_interval: data.confidence_interval || [data.percentile - 5, data.percentile + 5] as [number, number],
    }));

    const { primary } = calculateArchetype(scores);

    // Get user name if available
    let userName = "Someone";
    if (result.user_id) {
      const { data: user } = await supabase
        .from("users")
        .select("full_name, email")
        .eq("clerk_id", result.user_id)
        .single();
      
      if (user) {
        userName = user.full_name || user.email?.split("@")[0] || "Someone";
      }
    }

    return NextResponse.json({
      archetype: primary.name,
      icon: primary.icon,
      name: userName,
      tagline: primary.tagline,
    });
  } catch (error) {
    console.error("Error fetching basic result:", error);
    return NextResponse.json(
      { error: "Failed to fetch result" },
      { status: 500 }
    );
  }
}

