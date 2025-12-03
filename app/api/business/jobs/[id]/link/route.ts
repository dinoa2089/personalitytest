import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { supabase } from "@/lib/supabase";

// Generate a short unique token (12 chars, URL-safe)
function generateToken(length: number = 12): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const randomValues = new Uint8Array(length);
  crypto.getRandomValues(randomValues);
  return Array.from(randomValues, (v) => chars[v % chars.length]).join('');
}

// GET - Get current active link for job
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: jobId } = await params;
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // First try to get link from job_assessment_links table
    const { data: link } = await supabase
      .from("job_assessment_links")
      .select("*")
      .eq("job_posting_id", jobId)
      .eq("is_active", true)
      .single();

    if (link) {
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 
        (typeof window !== 'undefined' ? window.location.origin : "http://localhost:3000");

      return NextResponse.json({
        link: {
          ...link,
          url: `${baseUrl}/assessment/intro?job=${link.token}`,
        },
      });
    }

    // Fallback: Check legacy assessment_link_token on job_postings
    const { data: jobPosting } = await supabase
      .from("job_postings")
      .select("assessment_link_token")
      .eq("id", jobId)
      .single();

    if (jobPosting?.assessment_link_token) {
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
      return NextResponse.json({
        link: {
          token: jobPosting.assessment_link_token,
          url: `${baseUrl}/assessment/intro?job=${jobPosting.assessment_link_token}`,
          is_active: true,
          current_uses: 0,
          max_uses: null,
          expires_at: null,
          is_legacy: true,
        },
      });
    }

    return NextResponse.json({ link: null });
  } catch (error) {
    console.error("Error fetching job link:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - Create new link (deactivates any existing links)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: jobId } = await params;
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const { maxUses, expiresInDays } = body;

    // Verify user has access to this job posting
    const { data: jobPosting } = await supabase
      .from("job_postings")
      .select("id, business_id")
      .eq("id", jobId)
      .single();

    if (!jobPosting) {
      return NextResponse.json(
        { error: "Job posting not found" },
        { status: 404 }
      );
    }

    // Deactivate any existing links for this job
    await supabase
      .from("job_assessment_links")
      .update({ is_active: false })
      .eq("job_posting_id", jobId);

    // Generate short unique token
    const token = generateToken(12);

    // Calculate expiration date if specified
    const expiresAt = expiresInDays
      ? new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000).toISOString()
      : null;

    // Create new link
    const { data: link, error } = await supabase
      .from("job_assessment_links")
      .insert({
        job_posting_id: jobId,
        token,
        max_uses: maxUses || null,
        expires_at: expiresAt,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating job link:", error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    // Also update the legacy assessment_link_token for backwards compatibility
    await supabase
      .from("job_postings")
      .update({ assessment_link_token: token })
      .eq("id", jobId);

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    return NextResponse.json({
      link: {
        ...link,
        url: `${baseUrl}/assessment/intro?job=${token}`,
      },
    });
  } catch (error) {
    console.error("Error creating job link:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE - Deactivate link
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: jobId } = await params;
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Deactivate all links for this job
    await supabase
      .from("job_assessment_links")
      .update({ is_active: false })
      .eq("job_posting_id", jobId);

    // Also clear the legacy token
    await supabase
      .from("job_postings")
      .update({ assessment_link_token: null })
      .eq("id", jobId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting job link:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

