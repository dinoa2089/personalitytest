import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { supabase } from "@/lib/supabase";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { data: jobPosting, error } = await supabase
      .from("job_postings")
      .select("*")
      .eq("id", params.id)
      .single();

    if (error || !jobPosting) {
      return NextResponse.json(
        { error: "Job posting not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ job_posting: jobPosting });
  } catch (error) {
    console.error("Error fetching job posting:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { title, description, status, ideal_profile } = body;

    const updates: any = {};
    if (title !== undefined) updates.title = title;
    if (description !== undefined) updates.description = description;
    if (status !== undefined) updates.status = status;
    if (ideal_profile !== undefined) updates.ideal_profile = ideal_profile;
    updates.updated_at = new Date().toISOString();

    const { data: jobPosting, error } = await supabase
      .from("job_postings")
      .update(updates)
      .eq("id", params.id)
      .select()
      .single();

    if (error) {
      console.error("Error updating job posting:", error);
      return NextResponse.json(
        { error: "Failed to update job posting" },
        { status: 500 }
      );
    }

    return NextResponse.json({ job_posting: jobPosting });
  } catch (error) {
    console.error("Error updating job posting:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

