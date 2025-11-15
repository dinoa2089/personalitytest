/**
 * Client for the Python scoring API with fallback to mock scoring
 */
import type { QuestionResponse, AssessmentResult } from "@/types";
import { mockCalculateScores } from "./mock-scoring";

const SCORING_API_URL =
  process.env.NEXT_PUBLIC_SCORING_API_URL || "http://localhost:8000";

export async function calculateScores(
  responses: QuestionResponse[],
  sessionId: string
): Promise<AssessmentResult> {
  // Try to use Python API if available
  try {
    // Create timeout signal for older browsers
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
        include_frameworks: true, // Request framework mappings
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
  } catch (error) {
    // If API is not available or times out, use mock scoring
    console.warn("Scoring API unavailable, using mock scoring:", error);
  }

  // Fallback to mock scoring
  const mockResult = mockCalculateScores(responses, sessionId);
  return {
    ...mockResult,
    session_id: sessionId,
    created_at: new Date(),
  };
}

