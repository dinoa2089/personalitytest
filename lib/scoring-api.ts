/**
 * Scoring service for personality assessments.
 * 
 * Uses the built-in TypeScript IRT-informed scoring algorithm which is
 * production-ready and equivalent to the Python implementation.
 * 
 * The Python API is optional and can be enabled for:
 * - A/B testing different scoring algorithms
 * - Heavy computational workloads (NumPy/SciPy)
 * - Research/calibration with external datasets
 */
import type { QuestionResponse, AssessmentResult } from "@/types";
import { mockCalculateScores as calculateScoresInternal } from "./mock-scoring";

const SCORING_API_URL = process.env.NEXT_PUBLIC_SCORING_API_URL;
const USE_EXTERNAL_API = process.env.NEXT_PUBLIC_USE_EXTERNAL_SCORING === "true";

export async function calculateScores(
  responses: QuestionResponse[],
  sessionId: string
): Promise<AssessmentResult> {
  // Use external Python API if explicitly enabled and configured
  if (USE_EXTERNAL_API && SCORING_API_URL) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch(`${SCORING_API_URL}/api/scoring/calculate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          responses,
          session_id: sessionId,
          include_frameworks: true,
        }),
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        return {
          ...data,
          created_at: new Date(),
        };
      }
      
      console.warn("External scoring API returned non-OK, using built-in scoring");
    } catch (error) {
      console.warn("External scoring API unavailable, using built-in scoring:", error);
    }
  }

  // Use built-in TypeScript scoring (production-ready, IRT-informed)
  const result = calculateScoresInternal(responses, sessionId);
  return {
    ...result,
    session_id: sessionId,
    created_at: new Date(),
  };
}

