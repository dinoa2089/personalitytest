"use client";

import { UserButton, SignInButton, useUser } from "@clerk/nextjs";

export function ConditionalAuth() {
  // Check if Clerk is configured
  const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  
  // If Clerk not configured, don't show auth buttons
  if (!clerkKey || clerkKey === "") {
    return null;
  }
  
  // Clerk is configured - useUser hook must be called unconditionally
  // It will return safe defaults if ClerkProvider is not present
  const { isSignedIn, isLoaded } = useUser();
  
  // Don't render until Clerk is loaded (prevents hydration issues)
  if (!isLoaded) {
    return null;
  }
  
  if (isSignedIn) {
    return <UserButton afterSignOutUrl="/" />;
  }
  
  return (
    <SignInButton mode="modal">
      <button className="text-sm font-medium transition-colors hover:text-primary">
        Sign In
      </button>
    </SignInButton>
  );
}

