/**
 * Clerk configuration
 * ClerkProvider should be added to the root layout
 * Note: Clerk is optional - guest sessions work fine without it
 */
export const clerkConfig = {
  publishableKey: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || "",
};

// Only log in development mode, and make it clear it's optional
if (process.env.NODE_ENV === "development" && !clerkConfig.publishableKey) {
  console.info(
    "ℹ️ Clerk not configured - guest sessions enabled. This is fine for development! " +
    "To enable authentication, set NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env.local file."
  );
}

