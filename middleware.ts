import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Check if Clerk is configured
const CLERK_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

// Define protected routes (require authentication)
const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/settings(.*)',
]);

// Export Clerk middleware if configured, otherwise simple passthrough
export default CLERK_PUBLISHABLE_KEY && CLERK_PUBLISHABLE_KEY !== ''
  ? clerkMiddleware(async (auth, req) => {
      const url = req.nextUrl.pathname;

      // Protect dashboard and settings routes
      if (isProtectedRoute(req)) {
        await auth.protect();
        return;
      }

      // Allow guest access to results (for development and testing)
      if (url.startsWith('/results')) {
        return;
      }

      // All other routes are public
      return;
    })
  : function middleware(request: NextRequest) {
      console.info('ℹ️ Clerk not configured. Middleware is bypassed.');
      return NextResponse.next();
    };

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
