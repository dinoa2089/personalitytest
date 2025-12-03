import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { supabase } from "@/lib/supabase";

// GET /api/business/teams/[id]/members - Get team members
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    const { id } = await params;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: members, error } = await supabase
      .from("team_members")
      .select(
        `
        id,
        name,
        email,
        job_title,
        team_role,
        added_at,
        user_id,
        assessment_session_id,
        added_by
      `
      )
      .eq("team_id", id)
      .order("team_role", { ascending: true }) // Admins first
      .order("added_at", { ascending: false });

    if (error) {
      console.error("Error fetching team members:", error);
      return NextResponse.json(
        { error: "Failed to fetch team members" },
        { status: 500 }
      );
    }

    return NextResponse.json({ members: members || [] });
  } catch (error) {
    console.error("Error fetching team members:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Helper to check if user is team admin
async function isTeamAdmin(teamId: string, clerkUserId: string): Promise<boolean> {
  // First get the user's UUID from clerk_id
  const { data: user } = await supabase
    .from("users")
    .select("id")
    .eq("clerk_id", clerkUserId)
    .single();

  if (!user) return false;

  // Check if they're an admin of this team
  const { data: membership } = await supabase
    .from("team_members")
    .select("team_role")
    .eq("team_id", teamId)
    .eq("user_id", user.id)
    .eq("team_role", "admin")
    .single();

  return !!membership;
}

// POST /api/business/teams/[id]/members - Add team member
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    const { id } = await params;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, email, job_title, team_role, user_id, assessment_session_id } = body;

    if (!name) {
      return NextResponse.json(
        { error: "name is required" },
        { status: 400 }
      );
    }

    // Get current user's UUID for added_by field
    const { data: currentUser } = await supabase
      .from("users")
      .select("id")
      .eq("clerk_id", userId)
      .single();

    const { data: member, error } = await supabase
      .from("team_members")
      .insert({
        team_id: id,
        name,
        email: email || null,
        job_title: job_title || null,
        team_role: team_role || "member",
        user_id: user_id || null,
        assessment_session_id: assessment_session_id || null,
        added_by: currentUser?.id || null,
      })
      .select()
      .single();

    if (error) {
      console.error("Error adding team member:", error);
      return NextResponse.json(
        { error: "Failed to add team member" },
        { status: 500 }
      );
    }

    return NextResponse.json({ member }, { status: 201 });
  } catch (error) {
    console.error("Error adding team member:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PATCH /api/business/teams/[id]/members - Update a team member's role
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    const { id } = await params;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { member_id, team_role, job_title } = body;

    if (!member_id) {
      return NextResponse.json(
        { error: "member_id is required" },
        { status: 400 }
      );
    }

    const updateData: Record<string, string> = {};
    if (team_role) updateData.team_role = team_role;
    if (job_title !== undefined) updateData.job_title = job_title;

    const { data: member, error } = await supabase
      .from("team_members")
      .update(updateData)
      .eq("id", member_id)
      .eq("team_id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating team member:", error);
      return NextResponse.json(
        { error: "Failed to update team member" },
        { status: 500 }
      );
    }

    return NextResponse.json({ member });
  } catch (error) {
    console.error("Error updating team member:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/business/teams/[id]/members - Remove a team member (by member_id query param)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    const { id } = await params;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const memberId = searchParams.get("member_id");

    if (!memberId) {
      return NextResponse.json(
        { error: "member_id is required" },
        { status: 400 }
      );
    }

    // Check if this is the last admin
    const { data: admins } = await supabase
      .from("team_members")
      .select("id")
      .eq("team_id", id)
      .eq("team_role", "admin");

    const { data: memberToDelete } = await supabase
      .from("team_members")
      .select("team_role")
      .eq("id", memberId)
      .single();

    if (
      memberToDelete?.team_role === "admin" &&
      admins &&
      admins.length === 1
    ) {
      return NextResponse.json(
        { error: "Cannot remove the last admin. Promote another member first." },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from("team_members")
      .delete()
      .eq("id", memberId)
      .eq("team_id", id);

    if (error) {
      console.error("Error removing team member:", error);
      return NextResponse.json(
        { error: "Failed to remove team member" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error removing team member:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

