import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

const SCORING_API_URL = process.env.NEXT_PUBLIC_SCORING_API_URL || "http://localhost:8000";

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { job_description } = body;

    if (!job_description) {
      return NextResponse.json(
        { error: "Job description is required" },
        { status: 400 }
      );
    }

    // Call Python API to analyze job description
    const response = await fetch(`${SCORING_API_URL}/api/job-matching/analyze`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        job_description: job_description,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      return NextResponse.json(
        { error: "Failed to analyze job description", details: error },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error analyzing job description:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

