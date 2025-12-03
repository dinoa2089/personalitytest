import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { supabase } from "@/lib/supabase";

// GET - Get single candidate details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; candidateId: string }> }
) {
  try {
    const { candidateId } = await params;
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: candidate, error } = await supabase
      .from("applicant_assessments")
      .select(`
        *,
        assessment_sessions (
          id,
          completed_at
        )
      `)
      .eq("id", candidateId)
      .single();

    if (error) {
      console.error("Error fetching candidate:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ candidate });
  } catch (error) {
    console.error("Error in candidate API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PATCH - Update candidate status
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; candidateId: string }> }
) {
  try {
    const { candidateId } = await params;
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const updates = await request.json();

    // Allowed fields to update
    const allowedFields = [
      "status",
      "shortlisted",
      "notes",
      "rejection_reason",
      "interview_scheduled",
      "interview_notes",
    ];
    
    const filteredUpdates: Record<string, any> = {};
    for (const [key, value] of Object.entries(updates)) {
      if (allowedFields.includes(key)) {
        filteredUpdates[key] = value;
      }
    }

    // Auto-set reviewed_at when marking as reviewed
    if (filteredUpdates.status === "reviewed") {
      filteredUpdates.reviewed_at = new Date().toISOString();
    }

    filteredUpdates.updated_at = new Date().toISOString();

    const { data: candidate, error } = await supabase
      .from("applicant_assessments")
      .update(filteredUpdates)
      .eq("id", candidateId)
      .select()
      .single();

    if (error) {
      console.error("Error updating candidate:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ candidate });
  } catch (error) {
    console.error("Error in candidate update API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

