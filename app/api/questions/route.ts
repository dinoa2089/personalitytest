import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import {
  loadQuestionsForAssessment,
  getAssessmentConfig,
  getAvailableTiers,
  getSelectionStats,
  validateSelection,
  type AssessmentTier,
  type RequestedFramework,
} from "@/lib/questions";

/**
 * GET /api/questions
 * 
 * Query Parameters:
 *   - tier: "quick" | "standard" | "comprehensive" (default: "standard")
 *   - frameworks: comma-separated list of "prism,mbti,enneagram" (default: "prism")
 *   - raw: "true" to get all questions without selection (for admin/debug)
 *   - validate: "true" to include validation results
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parse tier parameter
    const tierParam = searchParams.get("tier") || "standard";
    const tier = ["quick", "standard", "comprehensive"].includes(tierParam)
      ? (tierParam as AssessmentTier)
      : "standard";
    
    // Parse frameworks parameter
    const frameworksParam = searchParams.get("frameworks") || "prism";
    const validFrameworks = ["prism", "mbti", "enneagram"];
    const frameworks = frameworksParam
      .split(",")
      .map((f) => f.trim().toLowerCase())
      .filter((f) => validFrameworks.includes(f)) as RequestedFramework[];
    
    // If no valid frameworks, default to prism
    if (frameworks.length === 0) {
      frameworks.push("prism");
    }
    
    // Raw mode - return all questions without selection
    if (searchParams.get("raw") === "true") {
      const { data: questions, error } = await supabase
        .from("questions")
        .select("*")
        .order("order_index", { ascending: true });

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json({
        questions: questions || [],
        total: questions?.length || 0,
        mode: "raw",
      });
    }
    
    // Load and select questions using the algorithm
    const questions = await loadQuestionsForAssessment(tier, frameworks);
    const config = getAssessmentConfig(tier);
    
    // Optionally include validation
    const shouldValidate = searchParams.get("validate") === "true";
    let validation = null;
    let stats = null;
    
    if (shouldValidate) {
      validation = validateSelection(questions, tier);
      stats = getSelectionStats(questions);
    }
    
    return NextResponse.json({
      questions,
      total: questions.length,
      tier,
      frameworks,
      config,
      ...(shouldValidate && { validation, stats }),
    });
  } catch (error) {
    console.error("Error fetching questions:", error);
    return NextResponse.json(
      { error: "Failed to fetch questions" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/questions/tiers
 * Returns available assessment tiers and their configurations
 */
export async function OPTIONS() {
  const tiers = getAvailableTiers();
  
  return NextResponse.json({
    tiers,
    frameworks: [
      { id: "prism", name: "PRISM-7", description: "7-dimension personality model" },
      { id: "mbti", name: "MBTI", description: "Myers-Briggs Type Indicator mapping" },
      { id: "enneagram", name: "Enneagram", description: "9-type Enneagram mapping" },
    ],
  });
}
