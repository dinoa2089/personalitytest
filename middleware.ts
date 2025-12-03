import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Check if Clerk is configured
const CLERK_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

// Define protected routes (require authentication)
const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/settings(.*)',
  '/results(.*)',  // Results require authentication
]);

// Export Clerk middleware if configured, otherwise simple passthrough
export default CLERK_PUBLISHABLE_KEY && CLERK_PUBLISHABLE_KEY !== ''
  ? clerkMiddleware(async (auth, req) => {
      try {
        const url = req.nextUrl.pathname;

        // For results pages, redirect to auth gate if not authenticated
        if (url.startsWith('/results/')) {
          try {
            const { userId } = await auth();
            if (!userId) {
              // Extract session ID from URL and redirect to auth gate
              const sessionId = url.split('/results/')[1]?.split('/')[0];
              if (sessionId) {
                return Response.redirect(new URL(`/assessment/complete/${sessionId}`, req.url));
              }
            }
          } catch {
            // Auth check failed - redirect to auth gate
            const sessionId = url.split('/results/')[1]?.split('/')[0];
            if (sessionId) {
              return Response.redirect(new URL(`/assessment/complete/${sessionId}`, req.url));
            }
          }
          return;
        }

        // Protect dashboard and settings routes
        if (isProtectedRoute(req)) {
          try {
            await auth.protect();
          } catch {
            // Protection failed - let Clerk handle the redirect
            return Response.redirect(new URL('/sign-in', req.url));
          }
          return;
        }

        // All other routes are public
        return;
      } catch (error) {
        console.error('Middleware error:', error);
        return NextResponse.next();
      }
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
