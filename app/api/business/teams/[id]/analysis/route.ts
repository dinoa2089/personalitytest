import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { supabase } from "@/lib/supabase";
import {
  analyzeTeam,
  calculateCompatibilityMatrix,
  calculateTeamSynergy,
  getRecommendedArchetypes,
  type TeamMember,
} from "@/lib/team-analysis";

// GET /api/business/teams/[id]/analysis - Get team analysis with scores
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

    // Get team members with their assessment scores
    const { data: members, error: membersError } = await supabase
      .from("team_members")
      .select(
        `
        id,
        name,
        email,
        role,
        assessment_session_id
      `
      )
      .eq("team_id", id);

    if (membersError) {
      console.error("Error fetching team members:", membersError);
      return NextResponse.json(
        { error: "Failed to fetch team members" },
        { status: 500 }
      );
    }

    if (!members || members.length === 0) {
      return NextResponse.json({
        members: [],
        analysis: {
          averageProfile: [],
          diversity: 0,
          strengths: [],
          gaps: [],
          recommendations: ["Add team members to see analysis."],
        },
        compatibility: [],
        synergy: 50,
        recommendedArchetypes: [],
      });
    }

    // Get assessment results for members who have them
    const sessionIds = members
      .filter((m) => m.assessment_session_id)
      .map((m) => m.assessment_session_id);

    let assessmentResults: Record<string, any> = {};

    if (sessionIds.length > 0) {
      const { data: results, error: resultsError } = await supabase
        .from("assessment_results")
        .select("session_id, dimensional_scores")
        .in("session_id", sessionIds);

      if (!resultsError && results) {
        results.forEach((result) => {
          assessmentResults[result.session_id] = result.dimensional_scores;
        });
      }
    }

    // Transform to analysis format
    const teamData: TeamMember[] = members
      .map((m) => ({
        id: m.id,
        name: m.name,
        email: m.email,
        role: m.role,
        scores: m.assessment_session_id
          ? assessmentResults[m.assessment_session_id] || []
          : [],
      }))
      .filter((m) => m.scores && m.scores.length > 0);

    // If no members have scores, return empty analysis
    if (teamData.length === 0) {
      return NextResponse.json({
        members: members.map((m) => ({
          id: m.id,
          name: m.name,
          email: m.email,
          role: m.role,
          scores: [],
        })),
        analysis: {
          averageProfile: [],
          diversity: 0,
          strengths: [],
          gaps: [],
          recommendations: [
            "Team members need to complete their assessments to enable analysis.",
          ],
        },
        compatibility: [],
        synergy: 50,
        recommendedArchetypes: [],
      });
    }

    const analysis = analyzeTeam(teamData);
    const compatibility = calculateCompatibilityMatrix(teamData);
    const synergy = calculateTeamSynergy(teamData);
    const recommendedArchetypes = getRecommendedArchetypes(analysis);

    return NextResponse.json({
      members: teamData,
      analysis,
      compatibility,
      synergy,
      recommendedArchetypes,
    });
  } catch (error) {
    console.error("Error analyzing team:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

