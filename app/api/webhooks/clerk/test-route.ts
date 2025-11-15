/**
 * Test endpoint to verify webhook route is accessible
 * Access at: /api/webhooks/clerk/test
 */
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    message: "Webhook endpoint is accessible",
    timestamp: new Date().toISOString(),
    path: "/api/webhooks/clerk",
  });
}

export async function POST(request: Request) {
  const body = await request.text();
  return NextResponse.json({
    message: "Webhook endpoint received POST request",
    bodyLength: body.length,
    timestamp: new Date().toISOString(),
    headers: Object.fromEntries(request.headers.entries()),
  });
}

