import { NextRequest, NextResponse } from "next/server";
import {
  authenticateApiRequest,
  logApiCall,
  ApiAuthError,
} from "@/lib/api-auth";

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  let apiKeyId: string | null = null;

  try {
    // Authenticate and check rate limit
    const { apiKey, rateLimit } = await authenticateApiRequest(request);
    apiKeyId = apiKey.id;

    // Parse request body
    const body = await request.json();

    // TODO: Implement actual analysis logic
    const result = {
      success: true,
      message: "Analysis endpoint - implement your logic here",
      tier: apiKey.tier,
      rateLimit: {
        remaining: rateLimit.remaining,
        limit: rateLimit.limit,
      },
      input: body,
    };

    const latency = Date.now() - startTime;

    // Log successful API call
    await logApiCall(apiKeyId, "/api/v1/analyze", 200, latency);

    return NextResponse.json(result, {
      headers: {
        "X-RateLimit-Limit": rateLimit.limit.toString(),
        "X-RateLimit-Remaining": rateLimit.remaining.toString(),
      },
    });
  } catch (error) {
    const latency = Date.now() - startTime;
    
    if (error instanceof ApiAuthError) {
      // Log auth errors
      if (apiKeyId) {
        await logApiCall(apiKeyId, "/api/v1/analyze", error.statusCode, latency);
      }
      
      return NextResponse.json(
        { error: error.message, code: error.statusCode === 429 ? "RATE_LIMITED" : "UNAUTHORIZED" },
        { status: error.statusCode }
      );
    }

    // Log server errors
    if (apiKeyId) {
      await logApiCall(apiKeyId, "/api/v1/analyze", 500, latency);
    }

    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error", code: "SERVER_ERROR" },
      { status: 500 }
    );
  }
}

// GET method for testing
export async function GET(request: NextRequest) {
  const startTime = Date.now();
  let apiKeyId: string | null = null;

  try {
    // Authenticate and check rate limit
    const { apiKey, rateLimit } = await authenticateApiRequest(request);
    apiKeyId = apiKey.id;

    const latency = Date.now() - startTime;
    await logApiCall(apiKeyId, "/api/v1/analyze", 200, latency);

    return NextResponse.json({
      success: true,
      message: "Personality Intelligence API v1 - Analyze endpoint",
      tier: apiKey.tier,
      rateLimit: {
        remaining: rateLimit.remaining,
        limit: rateLimit.limit,
        used: rateLimit.used,
      },
      endpoints: {
        POST: "Submit data for personality analysis",
      },
    }, {
      headers: {
        "X-RateLimit-Limit": rateLimit.limit.toString(),
        "X-RateLimit-Remaining": rateLimit.remaining.toString(),
      },
    });
  } catch (error) {
    const latency = Date.now() - startTime;
    
    if (error instanceof ApiAuthError) {
      if (apiKeyId) {
        await logApiCall(apiKeyId, "/api/v1/analyze", error.statusCode, latency);
      }
      
      return NextResponse.json(
        { error: error.message, code: error.statusCode === 429 ? "RATE_LIMITED" : "UNAUTHORIZED" },
        { status: error.statusCode }
      );
    }

    if (apiKeyId) {
      await logApiCall(apiKeyId, "/api/v1/analyze", 500, latency);
    }

    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error", code: "SERVER_ERROR" },
      { status: 500 }
    );
  }
}

