import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { supabase } from "@/lib/supabase";

// GET /api/business/teams - List all teams for an organization
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const organizationId = searchParams.get("organization_id");

    if (!organizationId) {
      return NextResponse.json(
        { error: "organization_id is required" },
        { status: 400 }
      );
    }

    const { data: teams, error } = await supabase
      .from("teams")
      .select(
        `
        id,
        name,
        description,
        created_at,
        team_members (count)
      `
      )
      .eq("organization_id", organizationId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching teams:", error);
      return NextResponse.json(
        { error: "Failed to fetch teams" },
        { status: 500 }
      );
    }

    return NextResponse.json({ teams: teams || [] });
  } catch (error) {
    console.error("Error fetching teams:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/business/teams - Create a new team
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { organization_id, name, description } = body;

    if (!organization_id || !name) {
      return NextResponse.json(
        { error: "organization_id and name are required" },
        { status: 400 }
      );
    }

    const { data: team, error } = await supabase
      .from("teams")
      .insert({
        organization_id,
        name,
        description: description || null,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating team:", error);
      return NextResponse.json(
        { error: "Failed to create team" },
        { status: 500 }
      );
    }

    return NextResponse.json({ team }, { status: 201 });
  } catch (error) {
    console.error("Error creating team:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}


