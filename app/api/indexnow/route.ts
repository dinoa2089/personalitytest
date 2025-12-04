import { NextRequest, NextResponse } from "next/server";

/**
 * IndexNow API endpoint for instant indexing on Bing, Yandex, and other search engines
 * 
 * Usage: POST /api/indexnow with body { urls: string[] }
 * This notifies search engines immediately when content changes
 */

const INDEXNOW_KEY = process.env.INDEXNOW_KEY || "prism7indexnow2024";
const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://prism7test.com";

// IndexNow endpoints for different search engines
const INDEXNOW_ENDPOINTS = [
  "https://api.indexnow.org/indexnow",
  "https://www.bing.com/indexnow",
  "https://yandex.com/indexnow",
];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { urls } = body as { urls: string[] };

    if (!urls || !Array.isArray(urls) || urls.length === 0) {
      return NextResponse.json(
        { error: "Missing or invalid urls array" },
        { status: 400 }
      );
    }

    // Validate URLs belong to our domain
    const validUrls = urls.filter((url) => {
      try {
        const parsed = new URL(url);
        return parsed.hostname === new URL(SITE_URL).hostname;
      } catch {
        return false;
      }
    });

    if (validUrls.length === 0) {
      return NextResponse.json(
        { error: "No valid URLs provided" },
        { status: 400 }
      );
    }

    const payload = {
      host: new URL(SITE_URL).hostname,
      key: INDEXNOW_KEY,
      keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
      urlList: validUrls,
    };

    // Submit to all IndexNow endpoints
    const results = await Promise.allSettled(
      INDEXNOW_ENDPOINTS.map(async (endpoint) => {
        const response = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
        return {
          endpoint,
          status: response.status,
          ok: response.ok,
        };
      })
    );

    const successCount = results.filter(
      (r) => r.status === "fulfilled" && r.value.ok
    ).length;

    return NextResponse.json({
      success: true,
      message: `Submitted ${validUrls.length} URLs to ${successCount}/${INDEXNOW_ENDPOINTS.length} search engines`,
      urls: validUrls,
      results: results.map((r) =>
        r.status === "fulfilled" ? r.value : { error: r.reason }
      ),
    });
  } catch (error) {
    console.error("IndexNow error:", error);
    return NextResponse.json(
      { error: "Failed to submit URLs" },
      { status: 500 }
    );
  }
}

/**
 * GET endpoint to check IndexNow status
 */
export async function GET() {
  return NextResponse.json({
    status: "active",
    key: INDEXNOW_KEY,
    keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
    endpoints: INDEXNOW_ENDPOINTS,
  });
}




