import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Check if Clerk is configured
const CLERK_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

// Define protected routes (require Clerk authentication)
const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/settings(.*)',
]);

// Define API v1 routes (require API key authentication)
// Excludes /api/v1/keys which uses Clerk auth for key management
const isApiV1Route = createRouteMatcher([
  '/api/v1/analyze(.*)',
  '/api/v1/person(.*)',
  '/api/v1/linkedin(.*)',
  '/api/v1/twitter(.*)',
]);

// Routes that use Clerk auth for API key management
const isApiKeyManagementRoute = createRouteMatcher([
  '/api/v1/keys(.*)',
]);

// ============================================================================
// Web Crypto API hash function (Edge Runtime compatible)
// ============================================================================

async function sha256Hash(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

// ============================================================================
// API Key Validation (Lightweight for Middleware)
// ============================================================================

async function validateApiKeyInMiddleware(request: NextRequest): Promise<{
  valid: boolean;
  error?: string;
  statusCode?: number;
}> {
  const authHeader = request.headers.get('Authorization');

  if (!authHeader) {
    return { valid: false, error: 'Missing Authorization header', statusCode: 401 };
  }

  if (!authHeader.startsWith('Bearer ')) {
    return { valid: false, error: 'Invalid Authorization format. Use: Bearer <api_key>', statusCode: 401 };
  }

  const apiKey = authHeader.substring(7);

  if (!apiKey || !apiKey.startsWith('sk_')) {
    return { valid: false, error: 'Invalid API key format', statusCode: 401 };
  }

  // Hash the key using Web Crypto API (Edge compatible)
  const keyHash = await sha256Hash(apiKey);

  // Validate against Supabase
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    return { valid: false, error: 'API authentication not configured', statusCode: 503 };
  }

  try {
    // Use fetch directly for lightweight middleware operation
    const response = await fetch(
      `${supabaseUrl}/rest/v1/api_keys?key_hash=eq.${keyHash}&select=id,is_active`,
      {
        headers: {
          'apikey': supabaseServiceKey,
          'Authorization': `Bearer ${supabaseServiceKey}`,
        },
      }
    );

    if (!response.ok) {
      return { valid: false, error: 'API key validation failed', statusCode: 401 };
    }

    const data = await response.json();

    if (!data || data.length === 0) {
      return { valid: false, error: 'Invalid API key', statusCode: 401 };
    }

    if (!data[0].is_active) {
      return { valid: false, error: 'API key has been deactivated', statusCode: 401 };
    }

    return { valid: true };
  } catch (error) {
    console.error('API key validation error:', error);
    return { valid: false, error: 'API key validation error', statusCode: 500 };
  }
}

// ============================================================================
// Main Middleware
// ============================================================================

async function handleApiV1Route(request: NextRequest): Promise<NextResponse> {
  const result = await validateApiKeyInMiddleware(request);

  if (!result.valid) {
    return NextResponse.json(
      {
        error: result.error,
        code: result.statusCode === 401 ? 'UNAUTHORIZED' : 'ERROR',
      },
      { status: result.statusCode || 401 }
    );
  }

  // API key is valid, continue to route handler
  return NextResponse.next();
}

// Combined middleware handler (when Clerk is not configured)
async function combinedMiddleware(request: NextRequest): Promise<NextResponse> {
  // API key management routes need auth (but Clerk isn't configured in this branch)
  if (isApiKeyManagementRoute(request)) {
    return NextResponse.json(
      { error: 'Authentication required. Please configure Clerk.' },
      { status: 401 }
    );
  }

  // Handle API v1 routes with API key auth
  if (isApiV1Route(request)) {
    return handleApiV1Route(request);
  }

  // For all other routes, just pass through
  return NextResponse.next();
}

// Export middleware based on Clerk configuration
export default CLERK_PUBLISHABLE_KEY && CLERK_PUBLISHABLE_KEY !== ''
  ? clerkMiddleware(async (auth, req) => {
      try {
        // API key management routes use Clerk auth
        if (isApiKeyManagementRoute(req)) {
          try {
            await auth.protect();
            return NextResponse.next();
          } catch {
            return NextResponse.json(
              { error: 'Authentication required' },
              { status: 401 }
            );
          }
        }

        // API v1 routes use API key auth
        if (isApiV1Route(req)) {
          return handleApiV1Route(req);
        }

        // Protect dashboard and settings routes with Clerk
        if (isProtectedRoute(req)) {
          try {
            await auth.protect();
          } catch {
            return Response.redirect(new URL('/sign-in', req.url));
          }
        }

        return NextResponse.next();
      } catch (error) {
        console.error('Middleware error:', error);
        return NextResponse.next();
      }
    })
  : combinedMiddleware;

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
