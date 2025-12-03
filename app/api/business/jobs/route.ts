import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { supabase } from "@/lib/supabase";

interface DimensionAnalysis {
  target: number;
  weight: number;
  reasoning: string;
}

interface JobAnalysis {
  title: string;
  dimensions: {
    openness: DimensionAnalysis;
    conscientiousness: DimensionAnalysis;
    extraversion: DimensionAnalysis;
    agreeableness: DimensionAnalysis;
    emotionalResilience: DimensionAnalysis;
    honestyHumility: DimensionAnalysis;
    adaptability: DimensionAnalysis;
  };
  keyPhrases: string[];
  overallReasoning: string;
}

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
    const { 
      title, 
      description, 
      sourceUrl,
      analysis, // The AI analysis result
      organizationId,
      // Legacy support
      business_id,
      ideal_profile,
    } = body;

    const orgId = organizationId || business_id;

    if (!title && !analysis?.title) {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 }
      );
    }

    if (!orgId) {
      return NextResponse.json(
        { error: "Organization ID is required" },
        { status: 400 }
      );
    }

    // Generate unique assessment link token
    const assessmentLinkToken = Array.from(crypto.getRandomValues(new Uint8Array(16)))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');

    // Check if we're using new analysis format or legacy format
    if (analysis) {
      // New format with structured AI analysis - use job_profiles table
      const { data: jobProfile, error } = await supabase
        .from("job_profiles")
        .insert({
          organization_id: orgId,
          title: analysis.title || title,
          description: description,
          source_url: sourceUrl || null,
          target_openness: analysis.dimensions.openness.target,
          target_conscientiousness: analysis.dimensions.conscientiousness.target,
          target_extraversion: analysis.dimensions.extraversion.target,
          target_agreeableness: analysis.dimensions.agreeableness.target,
          target_emotional_resilience: analysis.dimensions.emotionalResilience.target,
          target_honesty_humility: analysis.dimensions.honestyHumility.target,
          target_adaptability: analysis.dimensions.adaptability.target,
          weight_openness: analysis.dimensions.openness.weight,
          weight_conscientiousness: analysis.dimensions.conscientiousness.weight,
          weight_extraversion: analysis.dimensions.extraversion.weight,
          weight_agreeableness: analysis.dimensions.agreeableness.weight,
          weight_emotional_resilience: analysis.dimensions.emotionalResilience.weight,
          weight_honesty_humility: analysis.dimensions.honestyHumility.weight,
          weight_adaptability: analysis.dimensions.adaptability.weight,
          ai_reasoning: analysis.overallReasoning,
          keywords_extracted: analysis.keyPhrases,
          assessment_link_token: assessmentLinkToken,
          status: "active",
        })
        .select()
        .single();

      if (error) {
        console.error("Error creating job profile:", error);
        // Fall back to job_postings table if job_profiles doesn't exist
        return createLegacyJobPosting(orgId, title, description, analysis, assessmentLinkToken);
      }

      return NextResponse.json({ 
        job_profile: jobProfile,
        job_posting: jobProfile, // Alias for compatibility
        assessmentLink: `/assess/${assessmentLinkToken}`,
      });
    } else {
      // Legacy format - use job_postings table
      return createLegacyJobPosting(orgId, title, description, ideal_profile, assessmentLinkToken);
    }
  } catch (error) {
    console.error("Error in job creation:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

async function createLegacyJobPosting(
  businessId: string,
  title: string,
  description: string,
  idealProfile: any,
  assessmentLinkToken: string
) {
  const { data: jobPosting, error } = await supabase
    .from("job_postings")
    .insert({
      business_id: businessId,
      title: title,
      description: description,
      ideal_profile: idealProfile || null,
      assessment_link_token: assessmentLinkToken,
      status: "draft",
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating job posting:", error);
    return NextResponse.json(
      { error: "Failed to create job posting" },
      { status: 500 }
    );
  }

  return NextResponse.json({ 
    job_posting: jobPosting,
    assessmentLink: `/assess/${assessmentLinkToken}`,
  });
}

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const businessId = searchParams.get("business_id") || searchParams.get("organization_id");

    if (!businessId) {
      return NextResponse.json(
        { error: "business_id or organization_id is required" },
        { status: 400 }
      );
    }

    // Try to fetch from both tables
    const [profilesResult, postingsResult] = await Promise.all([
      supabase
        .from("job_profiles")
        .select("*")
        .eq("organization_id", businessId)
        .order("created_at", { ascending: false }),
      supabase
        .from("job_postings")
        .select("*")
        .eq("business_id", businessId)
        .order("created_at", { ascending: false }),
    ]);

    // Combine results, preferring job_profiles
    const profiles = profilesResult.data || [];
    const postings = postingsResult.data || [];

    // Transform profiles to common format
    const normalizedProfiles = profiles.map((p) => ({
      ...p,
      type: "profile",
      dimensions: {
        openness: { target: p.target_openness, weight: p.weight_openness },
        conscientiousness: { target: p.target_conscientiousness, weight: p.weight_conscientiousness },
        extraversion: { target: p.target_extraversion, weight: p.weight_extraversion },
        agreeableness: { target: p.target_agreeableness, weight: p.weight_agreeableness },
        emotionalResilience: { target: p.target_emotional_resilience, weight: p.weight_emotional_resilience },
        honestyHumility: { target: p.target_honesty_humility, weight: p.weight_honesty_humility },
        adaptability: { target: p.target_adaptability, weight: p.weight_adaptability },
      },
    }));

    const normalizedPostings = postings.map((p) => ({
      ...p,
      type: "posting",
    }));

    return NextResponse.json({ 
      job_profiles: normalizedProfiles,
      job_postings: normalizedPostings,
      // Combined for simple listings
      jobs: [...normalizedProfiles, ...normalizedPostings],
    });
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
