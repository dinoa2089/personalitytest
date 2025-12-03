import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { generateStructuredContent } from "@/lib/openrouter";

interface DimensionAnalysis {
  target: number;
  weight: number;
  reasoning: string;
}

interface JobAnalysisResult {
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

const ANALYSIS_PROMPT = `You are an expert industrial-organizational psychologist. Analyze this job description and determine the ideal personality profile for a candidate.

For each of the 7 PRISM-7 dimensions, provide:
1. TARGET SCORE (0-100): The ideal percentile for this role
2. WEIGHT (0.0-1.5): How important this dimension is (1.0 = normal, 1.5 = critical, 0.5 = less important)
3. REASONING: A brief explanation of why

PRISM-7 DIMENSIONS:
- Openness: Creativity, curiosity, intellectual flexibility
- Conscientiousness: Organization, reliability, attention to detail
- Extraversion: Social energy, assertiveness, comfort with people
- Agreeableness: Cooperation, empathy, conflict avoidance
- Emotional Resilience: Stress tolerance, calm under pressure, emotional stability
- Honesty-Humility: Authenticity, ethical behavior, modesty
- Adaptability: Flexibility, comfort with change, pivoting ability

SCORING GUIDELINES:
- 70-100: Role strongly requires high levels of this trait
- 40-70: Moderate levels are fine
- 0-40: Role may actually benefit from lower levels of this trait

JOB DESCRIPTION:
{jobDescription}

Respond with ONLY valid JSON matching this structure:
{
  "title": "Extracted or inferred job title",
  "dimensions": {
    "openness": { "target": 75, "weight": 1.2, "reasoning": "..." },
    "conscientiousness": { "target": 85, "weight": 1.5, "reasoning": "..." },
    "extraversion": { "target": 60, "weight": 1.0, "reasoning": "..." },
    "agreeableness": { "target": 70, "weight": 1.0, "reasoning": "..." },
    "emotionalResilience": { "target": 80, "weight": 1.3, "reasoning": "..." },
    "honestyHumility": { "target": 75, "weight": 1.0, "reasoning": "..." },
    "adaptability": { "target": 65, "weight": 1.1, "reasoning": "..." }
  },
  "keyPhrases": ["fast-paced environment", "team collaboration", "attention to detail"],
  "overallReasoning": "This role requires..."
}`;

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { jobDescription, sourceUrl } = await request.json();

    if (!jobDescription || jobDescription.length < 50) {
      return NextResponse.json(
        { error: "Job description must be at least 50 characters" },
        { status: 400 }
      );
    }

    // Analyze with AI using OpenRouter
    const prompt = ANALYSIS_PROMPT.replace("{jobDescription}", jobDescription);

    const result = await generateStructuredContent<JobAnalysisResult>(
      [{ role: "user", content: prompt }],
      {
        temperature: 0.3, // Lower temperature for more consistent analysis
      }
    );

    return NextResponse.json({
      success: true,
      analysis: result,
      sourceUrl: sourceUrl || null,
    });
  } catch (error) {
    console.error("Job analysis error:", error);
    return NextResponse.json(
      { error: "Failed to analyze job description" },
      { status: 500 }
    );
  }
}
